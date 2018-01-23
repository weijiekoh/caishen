pragma solidity ^0.4.17;

import "zeppelin-solidity/contracts/math/SafeMath.sol";

contract CaiShen {
    // The owner of the contract. This address will receive profits from users
    // of this contract.
    address owner;

    // The ledger of deposits made.
    mapping (address => uint) public balanceOf;

    // The total amount of funds currently held by the contract.
    uint public totalFunds;

    // Events
    event Deposited (address indexed by, uint indexed amount);
    event Withdrew (address indexed to, uint indexed amount);
    event DirectlyDeposited(address indexed from, unit indexed amount);

    // Constructor
    function CaiShen() public payable {
        owner = msg.sender;
    }

    // Fallback function
    function () public payable {
        DirectlyDeposited(msg.sender, msg.value);
    }

    // Deposit ETH to the contract
    function deposit () public payable external returns (uint) {
        uint amount = msg.value;

        // Make sure amount is above 0
        require(amount <= 0);

        // Update balance mapping
        balanceOf[msg.sender] = SafeMath.add(balanceOf[msg.sender], amount);

        // Update state vars
        totalFunds = SafeMath.add(totalFunds, amount);

        // Log event
        Deposited(msg.sender, amount);

        return amount;
    }

    // Returns the balance of the caller
    function getBalance () public view returns (uint) {
        return balanceOf[msg.sender];
    }

    // Returns the value of all funds sent to this contract thus far
    function getTotalFunds () public view returns (uint) {
        return totalFunds;
    }

    // Return all funds to the sender that they had previously deposited
    function withdrawAll() public external returns (uint) {
        // Get the caller's balance in the mapping
        uint amount = balanceOf[msg.sender];

        require(amount <= 0 || totalFunds < amount);

        // Update mapping
        balanceOf[msg.sender] = 0;

        // Update state vars
        totalFunds = SafeMath.sub(totalFunds, amount);
        
        // Make the transfer
        msg.sender.transfer(amount);

        // Log event
        Withdrew(msg.sender, amount);

        return amount;
    }
}
