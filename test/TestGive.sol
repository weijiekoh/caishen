pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CaiShen.sol";

contract TestGive {
    uint public initialBalance = 10 ether;
    //CaiShen cs = CaiShen(DeployedAddresses.CaiShen());
    CaiShen cs = new CaiShen();
    address recipient = 0x4e86D7E70cf98E599CACd145828B76354abEb6E9;
    uint expiry = now + 1;
    uint amount = 1 ether;
    uint fee = 0.001 ether;

    function beforeAll () public {
        cs.give.value(amount)(recipient, expiry);
    }

    function testGiftInfo () public {
        uint giftId = 0;

        var (resExists, resGiftId, resGiver, resRecipient,
             resExpiry, resAmount, resRedeemed) = cs.giftIdToGift(giftId);

        Assert.equal(resGiftId, giftId, "Gift ID should be 0");
        Assert.equal(resExists, true, "Gift should exist");
        Assert.equal(resGiver, this, "Gift giver should be test contract address");
        Assert.equal(resRecipient, recipient, "Gift recipient should be the correct");
        Assert.equal(resExpiry, expiry, "Gift expiry should be correct");
        Assert.equal(resAmount, amount - fee, "Gift amount - fee should be 0.999 ether");
        Assert.equal(resRedeemed, false, "Gift should not already been redeemed");
    }
}
