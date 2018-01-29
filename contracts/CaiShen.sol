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

    // Constructor
    function CaiShen() public payable {
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
    function give (address recipient, uint expiry) public payable returns (uint) {
        // The giver is the address which calls this contract
        address giver = msg.sender;

        // The gift must be a positive amount of ether
        require(msg.value > 0);
        
        // The expiry datetime must be in the future
        require(expiry > now);

        // The giver and the recipient must be different addresses
        require(giver != recipient);

        // Make sure nextGiftId is 0 or positive, or this contract is buggy
        assert(nextGiftId >= 0);

        // Append the gift to the mapping
        recipientToGiftIds[recipient].push(nextGiftId);

        uint feeTaken = fee(msg.value);
        assert(feeTaken >= 0);

        // Increment feesCollected
        feesCollected = SafeMath.add(feesCollected, feeTaken);

        uint amtGiven = SafeMath.sub(msg.value, feeTaken);
        // Update the giftIdToGift mapping with the new gift
        giftIdToGift[nextGiftId] = 
            Gift(true, nextGiftId, giver, recipient, expiry, amtGiven, false);

        assert(giftIdToGift[nextGiftId].exists == true);

        // Increment nextGiftId

        uint giftId = nextGiftId;

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

    function collectAllFees () public {
        uint amount = feesCollected;
        feesCollected = 0;
        owner.transfer(amount);
    }

    /********
    TODO:

    function changeRecipient (address newRecipient, giftId) public {}
    function returnToGiver (giftId) public {}
    function selfDestruct / returnAllFunds
    ********/
}
