pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CaiShen.sol";

contract TestWithdraw {
    uint public initialBalance = 10 ether;
    CaiShen cs = new CaiShen();

    function () public payable {
    }

    function beforeAll () public {
        cs.deposit.value(1 ether)();
    }

    function testWithdraw () public {
        cs.withdrawAll();
        uint amtWithdrawn = this.balance;
        Assert.equal(amtWithdrawn, 10 ether, "Expected withdrawal of 1 ether");
    }
}
