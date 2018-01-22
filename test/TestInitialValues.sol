pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CaiShen.sol";

contract TestInitialValues {
    //CaiShen hb = CaiShen(DeployedAddresses.CaiShen());
    CaiShen hb = new CaiShen();

    uint public initialBalance = 1 ether;

    function testGetNumTotalPayers () public {
        uint expected = 0;
        uint result = hb.getNumTotalPayers();

        Assert.equal(result, expected, "No payers expected initially.");
    }

    function testGetNumActivePayers () public {
        uint expected = 0;
        uint result = hb.getNumActivePayers();

        Assert.equal(result, expected, "No active payers expected initially.");
    }

    function testGetTotalFunds () public {
        uint expected = 0;
        uint result = hb.getTotalFunds();

        Assert.equal(result, expected, "No funds expected initially.");
    }

}
