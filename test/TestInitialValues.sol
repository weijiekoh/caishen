pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CaiShen.sol";

contract TestInitialValues {
    //CaiShen cs = CaiShen(DeployedAddresses.CaiShen());
    CaiShen cs = new CaiShen();

    uint public initialBalance = 1 ether;

    function testGetTotalFunds () public {
        uint expected = 0;
        uint result = cs.getTotalFunds();

        Assert.equal(result, expected, "No funds expected initially.");
    }
}
