pragma solidity ^0.4.17;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract CaiShen is Ownable {
    //// Data types

    // A Gift represent a time-locked red packet.
    struct Gift {
        bool exists;        // 0 Only true if this exists
        uint giftId;        // 1 The gift ID
        address giver;      // 2 The address of the giver
        address recipient;  // 3 The address of the recipient
        uint expiry;        // 4 The expiry datetime of the timelock as a
                            //   Unix timestamp
        uint amount;        // 5 The amount of Ether
        bool redeemed;      // 6 Whether the funds have already been redeemed
        bool returned;      // 7 Whether the funds were returned to the giver
        bool refunded;      // 8 Whether the funds were refunded to the giver
    }

    //// Mappings and state variables.

    // Total fees collected
    uint public feesCollected;

    // Each gift has a unique ID. To generate a new gift ID, increment
    // nextGiftId by 1.
    uint public nextGiftId;

    // Whether refunds are allowed. Set this to true using allowRefunds() only
    // in an emergency.  If refundsAllowed is true, then claimRefund() will
    // allow a refund to go through.
    bool refundsAllowed;

    // recipientToGiftIds maps each recipient address to a list of giftIDs of
    // Gifts they have received.
    mapping (address => uint[]) public recipientToGiftIds;

    // giftIdToGift maps each gift ID to its associated gift
    mapping (uint => Gift) public giftIdToGift;

    //// Events
    event Constructed (address indexed by, uint indexed amount);
    event DirectlyDeposited(address indexed from, uint indexed amount);

    event Gave (uint indexed giftId,
                address indexed giver,
                address indexed recipient,
                uint amount, uint expiry);

    event Redeemed (uint indexed giftId,
                    address indexed giver,
                    address indexed recipient,
                    uint amount);

    event ReturnedToGiver (uint indexed giftId);

    event ChangedRecipient (uint indexed giftId,
                            address indexed originalRecipient,
                            address indexed newRecipient);

    event RefundedToGiver(uint indexed giftId);
    event AllowedRefunds();
    event DisallowedRefunds();

    // Constructor
    function CaiShen() public payable {
        refundsAllowed = false; // disallow refunds by default
        Constructed(msg.sender, msg.value);
    }

    // Fallback function. Allows this contract to receive funds.
    function () public payable {
        DirectlyDeposited(msg.sender, msg.value);
    }

    //// Getter functions

    function getFeesCollected () public onlyOwner view returns (uint) {
        return feesCollected;
    }

    function doesGiftExist (uint giftId) public view returns (bool) {
        return giftIdToGift[giftId].exists;
    }

    function getGiftGiver (uint giftId) public view returns (address) {
        return giftIdToGift[giftId].giver;
    }

    function getGiftRecipient (uint giftId) public view returns (address) {
        return giftIdToGift[giftId].recipient;
    }

    function getGiftAmount (uint giftId) public view returns (uint) {
        return giftIdToGift[giftId].amount;
    }

    function getGiftExpiry (uint giftId) public view returns (uint) {
        return giftIdToGift[giftId].expiry;
    }

    function isGiftRedeemed (uint giftId) public view returns (bool) {
        return giftIdToGift[giftId].redeemed;
    }

    function isGiftReturned (uint giftId) public view returns (bool) {
        return giftIdToGift[giftId].returned;
    }

    function isGiftRefunded (uint giftId) public view returns (bool) {
        return giftIdToGift[giftId].refunded;
    }

    function getGiftIdsByRecipient (address recipient) public view returns (uint[]) {
        return recipientToGiftIds[recipient];
    }

    //// Contract functions

    // Call this function while sending ether to give a gift.
    // @recipient: the recipient's address
    // @expiry: the Unix timestamp of the expiry datetime.
    // Tested in test/test_give.js and test/TestGive.sol
    function give (address recipient, uint expiry) public payable returns (uint) {
        // The giver is the address which calls this contract
        address giver = msg.sender;

        // Validate the giver address
        assert(giver != 0);

        // The gift must be a positive amount of ether
        require(msg.value > 0);
        
        // The expiry datetime must be in the future.
        // It is fine to use the block timestamp in this contract because the
        // possible drift due to a malicious miner is only 12 minutes. See:
        // https://consensys.github.io/smart-contract-best-practices/recommendations/#timestamp-dependence
        require(expiry > now);

        // The giver and the recipient must be different addresses
        require(giver != recipient);

        // The recipient must be a valid address
        require(recipient != 0);

        // Make sure nextGiftId is 0 or positive, or this contract is buggy
        assert(nextGiftId >= 0);

        // Append the gift to the mapping
        recipientToGiftIds[recipient].push(nextGiftId);

        uint feeTaken = fee(msg.value);
        assert(feeTaken >= 0);

        // Increment feesCollected
        feesCollected = SafeMath.add(feesCollected, feeTaken);

        // Shave off the fee
        uint amtGiven = SafeMath.sub(msg.value, feeTaken);

        // Update the giftIdToGift mapping with the new gift
        giftIdToGift[nextGiftId] = 
            Gift(true,
                 nextGiftId,
                 giver,
                 recipient,
                 expiry,
                 amtGiven,
                 false,
                 false,
                 false);

        // Store nextGiftId in a temp variable
        uint giftId = nextGiftId;

        // Increment nextGiftId
        nextGiftId = SafeMath.add(giftId, 1);

        // Return the giftId of the new gift
        return giftId;
    }

    // Call this function to redeem a gift of ether.
    // Tested in test/test_redeem.js
    function redeem (uint giftId) public {
        //// If the following require statements are triggered, the user made a
        //// mistake or is up to no good.

        // The giftID should be 0 or positive
        require(giftId >= 0);

        // The gift must exist
        require(giftIdToGift[giftId].exists == true);

        // The gift must not already have been redeemed, returned, or refunded
        require(isValidGift(giftIdToGift[giftId]));

        // The recipient must be the caller of this function
        address recipient = giftIdToGift[giftId].recipient;
        require(recipient == msg.sender);

        // The current datetime must be after the expiry datetime
        require(now > giftIdToGift[giftId].expiry);

        //// If the following assert statements are triggered, this contract is
        //// buggy.

        // The amount must be positive because this was required in give()
        uint amount = giftIdToGift[giftId].amount;
        assert(amount > 0);

        // The giver must not be the recipient because this was required in give()
        address giver = giftIdToGift[giftId].giver;
        assert(giver != recipient);

        // Update the gift to mark it as redeemed, so that the funds cannot be
        // double-spent
        giftIdToGift[giftId].redeemed = true;

        // Transfer the funds
        recipient.transfer(amount);

        // Log the event
        Redeemed(giftId, giftIdToGift[giftId].giver, recipient, amount);
    }

    // Calculate the contract owner's fee
    // Tested in test/test_fee.js
    function fee (uint amount) public pure returns (uint) {
        require(amount >= 0);

        if (amount < 0.01 ether){
            return 0;
        }
        else if (amount >= 0.01 ether && amount < 0.1 ether){
            return SafeMath.div(amount, 100000);
        }
        else if (amount >= 0.1 ether && amount < 1 ether){
            return SafeMath.div(amount, 10000);
        }
        else if (amount >= 1 ether){
            return SafeMath.div(amount, 1000);
        }
    }

    // Transfer the fees collected thus far to the contract owner.
    // Tested in test/test_collect_fees.js
    function collectAllFees () onlyOwner public {
        // Store the fee amount in a temporary variable
        uint amount = feesCollected;

        // Make sure that the amount is positive
        require(amount > 0);

        // Set the feesCollected state variable to 0
        feesCollected = 0;

        // Make the transfer
        owner.transfer(amount);
    }

    // A recipient may change the recipient address of a Gift
    // Tested in test/test_change_recipient.js
    function changeRecipient (address newRecipient, uint giftId) public {
        // Validate the giftId
        require (giftId >= 0);

        // Validate the new recipient address
        require (newRecipient != 0);

        // The gift must exist
        require(giftIdToGift[giftId].exists == true);

        // The gift must not have been redeemed, returned, or refunded
        require(isValidGift(giftIdToGift[giftId]));
        
        // Only allow an existing recipient of the gift with giftId to change
        // the recipient
        require(msg.sender == giftIdToGift[giftId].recipient);

        // Update the gift
        giftIdToGift[giftId].recipient = newRecipient;

        // Remove the gift from the mapping for the old recipient
        assert(recipientToGiftIds[msg.sender].length > 0);
        uint len = recipientToGiftIds[msg.sender].length;
        bool updated = false;

        if (recipientToGiftIds[msg.sender][len-1] == giftId){
            delete recipientToGiftIds[msg.sender][len-1];
            recipientToGiftIds[msg.sender].length --;
            updated = true;
        }
        else{
            for (uint i=0; i < len-1; i++){
                if (recipientToGiftIds[msg.sender][i] == giftId){
                    uint lastGiftId = recipientToGiftIds[msg.sender][len-1];
                    recipientToGiftIds[msg.sender][i] = lastGiftId;
                    delete recipientToGiftIds[msg.sender][len-1];
                    recipientToGiftIds[msg.sender].length --;
                    updated = true;
                    break;
                }
            }
        }

        // Make sure the removal worked
        assert(updated == true);
        assert(len-1 == recipientToGiftIds[msg.sender].length);

        // Append the gift to the mapping for the new recipient
        recipientToGiftIds[newRecipient].push(giftId);
    
        // Log the event
        ChangedRecipient(giftId, msg.sender, newRecipient);
    }

    // Returns true only if the gift exists, and has not been redeemed/returned/refunded
    function isValidGift(Gift gift) pure internal returns (bool) {
        return gift.exists   == true  &&
               gift.redeemed == false &&
               gift.returned == false &&
               gift.refunded == false;
    }

    // A recipient may choose to return the funds to the giver
    // Tested by test/test_return_to_giver.js
    function returnToGiver (uint giftId) public {
        // Validate the giftId
        require (giftId >= 0);

        // The gift must exist
        require (giftIdToGift[giftId].exists == true);

        // The gift must not already have been redeemed, returned, or refunded
        require(isValidGift(giftIdToGift[giftId]));

        // Only the recipient can return funds to the giver
        require (giftIdToGift[giftId].recipient == msg.sender);

        // Only allow a positive fund transfer
        require (giftIdToGift[giftId].amount > 0);

        // Update the gift data
        giftIdToGift[giftId].returned = true;

        // Make the transfer
        giftIdToGift[giftId].giver.transfer(giftIdToGift[giftId].amount);

        // Log the event
        ReturnedToGiver(giftId);
    }

    // Only call this in the event that givers should be allowed to get their funds back
    function allowRefunds () onlyOwner public {
        refundsAllowed = true;
        AllowedRefunds(); // Log the event
    }

    // Reverse allowRefunds()
    function disallowRefunds () onlyOwner public {
        refundsAllowed = false;
        DisallowedRefunds(); // Log the event
    }

    // This function should only be called in the unlikey situation where the
    // funds have to be returned to all givers.
    // Refunds are only possible if the expiry datetime has not passed.
    // Tested by test/test_refund.js
    function claimRefund (uint giftId) public {
        // Only allow a refund if allowRefunds() has been invoked
        require (refundsAllowed == true);

        // Validate the gift
        require(isValidGift(giftIdToGift[giftId]));

        // Only a giver can call this function
        require (giftIdToGift[giftId].giver == msg.sender);

        // Only transfer positive amounts
        require (giftIdToGift[giftId].amount > 0);

        // Only allow refunds before the expiry
        require (giftIdToGift[giftId].expiry > now);
        
        // Mark the gift as refunded
        giftIdToGift[giftId].refunded = true;

        // Make the transfer
        giftIdToGift[giftId].giver.transfer(giftIdToGift[giftId].amount);

        // Log this event
        RefundedToGiver(giftId);
    }
}
