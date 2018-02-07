pragma solidity 0.4.18;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";


contract CaiShen is Ownable {
    //// Data types:
    struct Gift {
        bool exists;        // 0 Only true if this exists
        uint giftId;        // 1 The gift ID
        address giver;      // 2 The address of the giver
        address recipient;  // 3 The address of the recipient
        uint expiry;        // 4 The expiry datetime of the timelock as a
                            //   Unix timestamp
        uint amount;        // 5 The amount of ETH
        bool redeemed;      // 6 Whether the funds have already been redeemed
        bool refunded;      // 7 Whether the funds have already been refunded
    }

    //// Mappings and state variables:
    // Total fees collected
    uint public feesCollected;

    // Each gift has a unique ID. If you increment this value, you should get
    // an unused gift ID.
    uint public nextGiftId;

    // Whether refunds are allowed. Set this to true using allowRefunds() only
    // in an emergency. If refundsAllowed is true, claimRefund() will allow a
    // refund to go through.
    bool private refundsAllowed;

    // recipientToGiftIds maps each recipient address to a list of giftIDs of
    // Gifts they have received.
    mapping (address => uint[]) public recipientToGiftIds;

    // giftIdToGift maps each gift ID to its associated gift.
    mapping (uint => Gift) public giftIdToGift;

    //// Events:

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

    event CollectedAllFees (address indexed by, uint indexed amount);

    event ClaimedRefund(address by, uint indexed amount, uint indexed giftId);
    event AllowedRefunds(address indexed by);
    event DisallowedRefunds(address indexed by);

    // Constructor
    function CaiShen() public payable {
        refundsAllowed = false; // disallow refunds by default
        Constructed(msg.sender, msg.value);
    }

    // Fallback function which allows this contract to receive funds.
    function () public payable {
        // Sending ETH directly to this contract does nothing except log an
        // event.
        DirectlyDeposited(msg.sender, msg.value);
    }

    //// Getter functions:
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

    function isGiftRefunded (uint giftId) public view returns (bool) {
        return giftIdToGift[giftId].refunded;
    }

    function getGiftIdsByRecipient (address recipient) 
    public view returns (uint[]) {
        return recipientToGiftIds[recipient];
    }

    //// Contract functions:
    // Call this function while sending ETH to give a gift.
    // @recipient: the recipient's address
    // @expiry: the Unix timestamp of the expiry datetime.
    // Tested in test/test_give.js and test/TestGive.sol
    function give (address recipient, uint expiry) public payable returns (uint) {
        address giver = msg.sender;

        // Validate the giver address
        assert(giver != address(0));

        // The gift must be a positive amount of ETH
        uint amount = msg.value;
        require(amount > 0);
        
        // The expiry datetime must be in the future. It is fine to use the
        // block timestamp in this contract because the possible drift is 
        // only 12 minutes. See: https://consensys.github.io
        // /smart-contract-best-practices/recommendations/#timestamp-dependence
        require(expiry > now);

        // The giver and the recipient must be different addresses
        require(giver != recipient);

        // The recipient must be a valid address
        require(recipient != address(0));

        // Make sure nextGiftId is 0 or positive, or this contract is buggy
        assert(nextGiftId >= 0);

        // Append the gift to the mapping
        recipientToGiftIds[recipient].push(nextGiftId);

        // Calculate the contract owner's fee
        uint feeTaken = fee(amount);
        assert(feeTaken >= 0);

        // Increment feesCollected
        feesCollected = SafeMath.add(feesCollected, feeTaken);

        // Shave off the fee
        uint amtGiven = SafeMath.sub(amount, feeTaken);
        assert(amtGiven > 0);

        // If a gift with this new gift ID already exists, this contract is buggy.
        assert(giftIdToGift[nextGiftId].exists == false);

        // Update the giftIdToGift mapping with the new gift
        giftIdToGift[nextGiftId] = 
            Gift(true, nextGiftId, giver, recipient, expiry, amtGiven, false, false);

        uint giftId = nextGiftId;

        // Increment nextGiftId
        nextGiftId = SafeMath.add(giftId, 1);

        // If a gift with this new gift ID already exists, this contract is buggy.
        assert(giftIdToGift[nextGiftId].exists == false);

        // Log the event
        Gave(giftId, giver, recipient, amount, expiry);

        return giftId;
    }

    // Call this function to redeem a gift of ETH.
    // Tested in test/test_redeem.js
    function redeem (uint giftId) public {
        // The giftID should be 0 or positive
        require(giftId >= 0);

        // The gift must exist
        require(giftIdToGift[giftId].exists == true);

        // The gift must exist and must not have already been redeemed
        require(isValidGift(giftIdToGift[giftId]));

        // The recipient must be the caller of this function
        address recipient = giftIdToGift[giftId].recipient;
        require(recipient == msg.sender);

        // The current datetime must be after the expiry datetime
        require(now > giftIdToGift[giftId].expiry);

        //// If the following assert statements are triggered, this contract is
        //// buggy.

        // The amount must be positive because this is required in give()
        uint amount = giftIdToGift[giftId].amount;
        assert(amount > 0);

        // The giver must not be the recipient because this was asserted in give()
        address giver = giftIdToGift[giftId].giver;
        assert(giver != recipient);

        // Make sure the giver is valid because this was asserted in give();
        assert(giver != address(0));

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
        if (amount <= 0.01 ether) {
            return 0;
        } else if (amount > 0.01 ether) {
            return SafeMath.div(amount, 100);
        }
    }

    // Transfer the fees collected thus far to the contract owner.
    // Only the contract owner may invoke this function.
    // Tested in test/test_collect_fees.js
    function collectAllFees () public onlyOwner {
        // Store the fee amount in a temporary variable
        uint amount = feesCollected;

        // Make sure that the amount is positive
        require(amount > 0);

        // Set the feesCollected state variable to 0
        feesCollected = 0;

        // Make the transfer
        owner.transfer(amount);

        CollectedAllFees(owner, amount);
    }

    // This function should only be called in the unlikey situation where the
    // funds have to be returned to all givers. Refunds are only possible if
    // the expiry datetime has not passed.
    // Tested by test/test_refund.js
    function claimRefund(uint giftId) public {
        // Only allow a refund if allowRefunds() has been invoked
        require(refundsAllowed == true);

        // The gift must exist and must not have already been redeemed
        require(isValidGift(giftIdToGift[giftId]));

        // Only the gift giver can call this function
        address giver = giftIdToGift[giftId].giver;
        require(giver == msg.sender);

        // Make sure the giver's address is valid as this is asserted in give() and redeem():
        assert(giftIdToGift[giftId].giver != address(0));

        // Only transfer positive amounts
        uint amount = giftIdToGift[giftId].amount;
        require(amount > 0);

        // Only allow refunds before the expiry
        require(giftIdToGift[giftId].expiry > now);
        
        // Mark the gift as refunded
        giftIdToGift[giftId].refunded = true;

        // Make the transfer
        giver.transfer(amount);

        // Log this event
        ClaimedRefund(giver, amount, giftId);
    }

    // Only call this in the event that givers should be allowed to get their funds back
    function allowRefunds () public onlyOwner {
        refundsAllowed = true;
        AllowedRefunds(owner); // Log the event
    }

    // Reverse allowRefunds()
    function disallowRefunds () public onlyOwner {
        refundsAllowed = false;
        DisallowedRefunds(owner); // Log the event
    }

    // Returns true only if the gift exists and has not already been
    // redeemed
    function isValidGift(Gift gift) private pure returns (bool) {
        return gift.exists == true && gift.redeemed == false;
    }
}
