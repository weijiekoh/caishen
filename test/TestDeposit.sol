pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CaiShen.sol";

contract TestDeposit {
    uint public initialBalance = 10 ether;
    //CaiShen cs = CaiShen(DeployedAddresses.CaiShen());
    CaiShen cs = new CaiShen();

    function beforeAll () public {
        cs.deposit.value(1 ether)();
    }

    function testGetTotalFunds () public {
        uint expected = 1 ether;
        uint balance = cs.getTotalFunds();

        Assert.equal(balance, expected, "Expected balance of 1 ether");
    }

    //function testSendDirect () public {
        //cs.transfer(1 ether);
    //}
}
