pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CaiShen.sol";

contract TestWithdraw {
    uint public initialBalance = 10 ether;
    CaiShen hb = new CaiShen();

    function beforeAll () public {
        hb.deposit.value(1 ether)();
    }

    function () public payable {
    }

    function testWithdraw () public {
        uint amtWithdrawn = hb.withdrawAll();
        Assert.equal(amtWithdrawn, 1 ether, "Expected withdrawal of 1 ether");
        //uint expected = 10 ether;
        //uint result = this.balance;

        //Assert.equal(result, expected, "Expected balance of 10 ether");
    }
}
