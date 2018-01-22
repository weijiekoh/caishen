pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CaiShen.sol";

contract TestDeposit {
    uint public initialBalance = 10 ether;
    //CaiShen hb = CaiShen(DeployedAddresses.CaiShen());
    CaiShen hb = new CaiShen();

    function beforeAll () public {
        hb.deposit.value(1 ether)();
    }

    function testGetTotalFunds () public {
        uint expected = 1 ether;
        uint balance = hb.getTotalFunds();

        Assert.equal(balance, expected, "Expected balance of 1 ether");
    }

    function testGetNumTotalPayers () public {
        uint expected = 1;
        uint result = hb.getNumTotalPayers();

        Assert.equal(result, expected, "Expected 1 payer in total.");
    }

    function testGetNumActivePayers () public {
        uint expected = 1;
        uint result = hb.getNumActivePayers();

        Assert.equal(result, expected, "Expected 1 active payer.");
    }


}
