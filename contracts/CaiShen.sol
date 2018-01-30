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
    }

    //// Mappings and state variables.

    // Total fees collected

    uint public feesCollected;

    // Each gift has a unique ID. To generate a new gift ID, increment
    // nextGiftId by 1.
    uint public nextGiftId;


    // Whether refunds are allowed. Set this to true using allowRefunds() only in an emergency.
    // If refundsAllowed is true, then claimRefund() will allow a refund to go through.
    bool refundsAllowed;

    // recipientToGiftIds maps each recipient address to a list of giftIDs of
    // Gifts they have received.
    mapping (address => uint[]) public recipientToGiftIds;

    // giftIdToGift maps each gift ID to its associated gift
    mapping (uint => Gift) public giftIdToGift;

    //// Events
    event Constructed (address indexed by, uint indexed amount);
    event Gave (uint indexed giftId, address indexed giver, address indexed recipient, uint amount, uint expiry);
    event Redeemed (uint indexed giftId, address indexed giver, address indexed recipient, uint amount);
    event ChangedRecipient (uint indexed giftId, address indexed originalRecipient, address indexed newRecipient);
    event DirectlyDeposited(address indexed from, uint indexed amount);
    event ReturnFundsStarted(address indexed caller);
    event ReturnedFundsToGivers(uint indexed amount);

    // Constructor
    function CaiShen() public payable {
        refundsAllowed = false;
        Constructed(msg.sender, msg.value);
    }

    // Fallback function. Allows this contract to receive funds.
    function () public payable {
        DirectlyDeposited(msg.sender, msg.value);
    }

    //// Getter functions

    function doesGiftExist (uint giftId) public constant returns (bool) {
        return giftIdToGift[giftId].exists;
    }

    function getGiftGiver (uint giftId) public constant returns (address) {
        return giftIdToGift[giftId].giver;
    }

    function getGiftRecipient (uint giftId) public constant returns (address) {
        return giftIdToGift[giftId].recipient;
    }

    function getGiftAmount (uint giftId) public constant returns (uint) {
        return giftIdToGift[giftId].amount;
    }

    function getGiftExpiry (uint giftId) public constant returns (uint) {
        return giftIdToGift[giftId].expiry;
    }

    function isGiftRedeemed (uint giftId) public constant returns (bool) {
        return giftIdToGift[giftId].redeemed;
    }

    function getGiftIdsByRecipient (address recipient) public constant returns (uint[]) {
        return recipientToGiftIds[recipient];
    }

    //// Contract functions

    // Call this function while sending ether to give a gift.
    // @recipient: the recipient's address
    // @expiry: the Unix timestamp of the expiry datetime.
    // It is fine to use the block timestamp in this contract because the
    // possible drift due to a malicious miner is only 12 minutes. See:
    // https://consensys.github.io/smart-contract-best-practices/recommendations/#timestamp-dependence
    function give (address recipient, uint expiry) public payable returns (uint) {
        // The giver is the address which calls this contract
        address giver = msg.sender;

        // The gift must be a positive amount of ether
        require(msg.value > 0);
        
        // The expiry datetime must be in the future
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
            Gift(true, nextGiftId, giver, recipient, expiry, amtGiven, false);

        // Make sure that the exists property is true
        assert(giftIdToGift[nextGiftId].exists == true);

        // Make sure that the redeemed property is false
        assert(giftIdToGift[nextGiftId].redeemed == false);

        // Store nextGiftId in a temp variable
        uint giftId = nextGiftId;

        // Increment nextGiftId
        nextGiftId = SafeMath.add(giftId, 1);

        // Return the giftId of the new gift
        return giftId;
    }

    // Call this function to redeem a gift of ether.
    function redeem (uint giftId) public {
        //// If the following require statements are triggered, the user made a
        //// mistake or is up to no good.

        // The giftID should be 0 or positive
        require(giftId >= 0);

        // The gift must exist
        require(giftIdToGift[giftId].exists == true);

        // The gift must not already have been redeemed
        require(giftIdToGift[giftId].redeemed == false);

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
        assert(giftIdToGift[giftId].giver != giftIdToGift[giftId].recipient);

        // Update the gift to mark it as redeemed, so that the funds cannot be
        // double-spent
        giftIdToGift[giftId].redeemed = true;

        // Transfer the funds
        recipient.transfer(amount);

        // Log the event
        Redeemed(giftId, giftIdToGift[giftId].giver, recipient, amount);
    }

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


    //// Return all funds to the givers. Only the contract owner can call this.
    //// Not recommended because it might take up a lot of gas.
    //function returnFundsToGivers () onlyOwner public {
        //ReturnFundsStarted(msg.sender);
        //uint total = 0; // Keep track of the total amount refunded
        //uint i = 0; // Loop counter

        //while(true){
            //if (i >= nextGiftId){
                //// Exit the loop when all the gift IDs are exhausted
                //break;
            //}

            //// Do the refuld if the gift exists and has not been redeemed
            //else if (giftIdToGift[i].exists && giftIdToGift[i].redeemed == false){
                //// Update the total
                //SafeMath.add(total, giftIdToGift[i].amount);
                //// Update the loop counter
                //// Make the transfer.
                //giftIdToGift[i].giver.transfer(giftIdToGift[i].amount);
            //}
            //i = SafeMath.add(i, 1);
        //}

        //// Log the event
        //ReturnedFundsToGivers(total);
    //}

    // A recipient may change the recipient address of a Gift
    function changeRecipient (address newRecipient, uint giftId) public {
        // Validate the giftId
        require (giftId >= 0);

        // Validate the new recipient address
        require (newRecipient != 0);

        // The gift must exist and be unredeemed
        require(giftIdToGift[giftId].exists == true);
        require(giftIdToGift[giftId].redeemed == false);
        
        // Only allow an existing recipient of the gift with giftId to change
        // the recipient
        require(msg.sender == giftIdToGift[giftId].recipient);

        // Update the gift
        giftIdToGift[giftId].recipient = newRecipient;
    }

    // A recipient may choose to return the funds to the giver
    function returnToGiver (uint giftId) public {
        // Validate the giftId
        require (giftId >= 0);

        // The gift must exist and be unredeemed
        require (giftIdToGift[giftId].exists == true);
        require (giftIdToGift[giftId].redeemed == false);

        // Only the recipient can return funds to the giver
        require (giftIdToGift[giftId].recipient == msg.sender);

        // Only allow a positive fund transfer
        require (giftIdToGift[giftId].amount > 0);

        // Make the transfer
        giftIdToGift[giftId].giver.transfer(giftIdToGift[giftId].amount);
    }

    // Only call this in the event that givers should be allowed to get their funds back
    function allowRefunds () onlyOwner public {
        refundsAllowed = true;
    }

    // Reverse allowRefunds()
    function disallowRefunds () onlyOwner public {
        refundsAllowed = false;
    }

    // Let a giver get their funds back
    function claimRefund (uint giftId) public {
        // only work if refundsAllowed == true
        require (refundsAllowed == true);

        // Validate the gift
        require (giftIdToGift[giftId].exists == true);
        require (giftIdToGift[giftId].redeemed == false);

        // Only a giver can call this function
        require (giftIdToGift[giftId].giver == msg.sender);
        require (giftIdToGift[giftId].recipient != msg.sender);

        // Only transfer positive amounts
        require (giftIdToGift[giftId].amount > 0);

        // Only allow refunds before the expiry
        require (giftIdToGift[giftId].expiry > now);

        // Make the transfer
        giftIdToGift[giftId].giver.transfer(giftIdToGift[giftId].amount);
    }

}
