pragma solidity ^0.4.17;

contract CaiShen {
    // State data
    mapping (address => uint) public balanceOf;
    uint public totalFunds;
    uint numTotalPayers;
    uint numActivePayers;
    address owner;

    // Constructor
    function CaiShen() public payable {
        owner = msg.sender;
    }

    // Fallback function: do not accept direct transfers of ether to this contract.
    function () public payable {
        revert();
    }

    // Events
    event Deposited(address indexed by, uint amount);
    event Withdrew(address indexed to, uint amount);

    // Functions

    // Deposit ETH to the contract
    function deposit () public payable returns (uint) {
        uint amount = msg.value;

        // Make sure amount is above 0
        assert(amount > 0);

        // Update balance mapping
        balanceOf[msg.sender] += amount;

        // Update state vars
        totalFunds += amount;
        numTotalPayers += 1;
        numActivePayers += 1;

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

    // Returns the total number of payers
    function getNumTotalPayers () public view returns (uint) {
        return numTotalPayers;
    }

    // Returns the number of active payers
    function getNumActivePayers () public view returns (uint) {
        return numActivePayers;
    }

    // Return all funds to the sender that they had previously deposited
    function withdrawAll() public returns (uint) {
        // Get the caller's balance in the mapping
        uint amount = balanceOf[msg.sender];

        if (amount > 0 && totalFunds >= amount){

            // Update mapping
            balanceOf[msg.sender] = 0;

            // Update state vars
            totalFunds -= amount;
            numActivePayers -= 1;
            
            // Make the transfer
            msg.sender.transfer(amount);

            // Log event
            Withdrew(msg.sender, amount);
        }

        return amount;
    }
}
