pragma solidity ^0.4.17;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract CaiShen is Ownable {
    //// The ledger of deposits made.
    //mapping (address => uint) public balanceOf;

    //// The total amount of funds currently held by the contract.
    //uint public totalFunds;

    //// Events
    //event Deposited (address indexed by, uint indexed amount);
    //event Withdrew (address indexed to, uint indexed amount);
    //event DirectlyDeposited(address indexed from, uint indexed amount);

    //// Constructor
    //function CaiShen() public payable {
    //}

    //// Fallback function
    //function () public payable {
        //DirectlyDeposited(msg.sender, msg.value);
    //}

    //// Deposit ETH to the contract
    //function deposit () public payable returns (uint) {
        //uint amount = msg.value;

        //// Make sure amount is above 0
        //require(amount <= 0);

        //// Update balance mapping
        //balanceOf[msg.sender] = SafeMath.add(balanceOf[msg.sender], amount);

        //// Update state vars
        //totalFunds = SafeMath.add(totalFunds, amount);

        //// Log event
        //Deposited(msg.sender, amount);

        //return amount;
    //}

    //// Returns the balance of the caller
    //function getBalance () public view returns (uint) {
        //return balanceOf[msg.sender];
    //}

    //// Returns the value of all funds sent to this contract thus far
    //function getTotalFunds () public view returns (uint) {
        //return totalFunds;
    //}

    //// Return all funds to the sender that they had previously deposited
    //function withdrawAll() public returns (uint) {
        //// Get the caller's balance in the mapping
        //uint amount = balanceOf[msg.sender];

        //require(amount > 0 && totalFunds <= amount);

        //// Update mapping
        //balanceOf[msg.sender] = 0;

        //// Update state vars
        //totalFunds = SafeMath.sub(totalFunds, amount);
        
        //// Make the transfer
        //msg.sender.transfer(amount);

        //// Log event
        //Withdrew(msg.sender, amount);

        //return amount;
    //}

    ////TODO
    ////function calculateFee(uint amount) public pure returns (uint) {
        ////return amount;
    ////}
    ////function changeRecipient(address newRecipient) public {
    ////}
    ////function returnAllToGifter(address gifter) public {
    ////}
}
