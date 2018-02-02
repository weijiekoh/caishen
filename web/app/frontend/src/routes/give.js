import { h, Component } from 'preact'

import Web3Enabled from "../components/Web3Enabled.js";
import EthAmountInput from "../components/input/EthAmountInput.js";
import ExpiryDateInput from "../components/input/ExpiryDateInput.js";
import EthAccountInput from "../components/input/EthAccountInput.js";

var Web3 = require("web3");


export default class Give extends Web3Enabled{
  constructor(props){
    super(props);

    this.filter = null;

    Object.assign(this.state, {
      blankInputs: false,

      address: null,
      balance: null,

      amount: "",
      expiry: "",
      recipient: "",

      validAmount: false,
      validExpiry: false,
      validRecipient: false,

      showErrorMsgs: false,

      transactions: [],
    });
  }


  handleRecipientChange = (value, valid) => {
    this.setState({ 
      recipient: value,
      validRecipient: valid,
    });
  }


  handleAmountChange = (value, valid) => {
    this.setState({
      amount: value,
      validAmount: valid,
    });
  }


  handleExpiryChange = (value, valid) => {
    this.setState({ 
      expiry: ExpiryDateInput.parseDate(value),
      validExpiry: valid,
    });
  }


  handleGiveBtnClick = () => {
    const valid = this.state.validAmount &&
      this.state.validRecipient &&
      this.state.validExpiry;


    if (valid){
      const recipientAddress = this.state.address;
      const amountWei = web3.toWei(this.state.amount, "ether");
      const expiry = this.state.expiry.getTime() / 1000;
      const payload = {
        value: amountWei,
        from: this.state.address
      };

      console.log("Calling contract's give()");
      console.log(recipientAddress, expiry, payload);

      // Estimate gas
      this.caishen.give.estimateGas(recipientAddress, expiry, {value: amountWei}).then(gas => {
        console.log("gas", gas);
        payload.gas = gas;

        console.log(recipientAddress, expiry, payload);

        this.caishen.give(recipientAddress, expiry, payload).then(tx => {
          console.log("tx:", tx);

          let transactions = this.state.transactions;
          if (typeof transactions === "undefined"){
            transactions = [];
          }

          transactions.push({
            txHash: tx.receipt.transactionHash,
            txAmount: amountWei,
            txExpiry: expiry,
            txRecipient: recipientAddress,
          });
          return transactions;
        }).then(transactions => {
          this.setState({ 
            transactions: transactions,
            blankInputs: true,
          });
        });
      });
    }
    else {
      this.setState({ 
        showErrorMsgs: true,
      });
    }
  }

  renderTransactions = transactions => {

    const formatDate = timestamp => {
      const months = [ "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

      const d = new Date(timestamp * 1000);
      const year = d.getFullYear().toString();
      const month = months[d.getMonth() + 1];
      const day = d.getDate().toString();

      return day + " " + month + " " + year;
    }

    return transactions.map((transaction, i) => 
        <div class="transaction_success">
          <em class="success">#{i+1} Gift transaction broadcasted.</em>
          <p>
            <a target="_blank" href={"https://etherscan.io/tx/" + transaction.txHash}>
              Click here
            </a> to 
            view the status of the transaction.
          </p>
          <p>If it is successfully mined, the owner of the ETH address
            <pre>{transaction.txRecipient}</pre> may 
            redeem {web3.fromWei(transaction.txAmount)} ETH 
            after midnight, {formatDate(transaction.txExpiry)}.
          </p>
          <hr />
        </div>
    );
  }

  renderUnlockedWeb3() {
    const dateLabel = "Enter the earliest date for the recipient to claim the funds (dd/mm/yyyy).";

    return (
      <div class="give pure-form pure-form-stacked">
        <h1>Give a smart red packet</h1>

        {this.renderAccountInfo()}

        <hr />

        {this.state.transactions && this.state.transactions.length > 0 &&
          this.renderTransactions(this.state.transactions)}

        {this.state.transactions && this.state.transactions.length > 0 &&
            <h2>Give another smart red packet:</h2>}

        <fieldset>
          <EthAmountInput 
            name="amount"
            blank={this.state.blankInputs}
            label="Enter the amount of ETH to give."
            handleChange={this.handleAmountChange}
            showErrorMsgs={this.state.showErrorMsgs}
            handleEnterKeyDown={this.handleGiveBtnClick}
            maximum={this.state.balance}
            smallerInput={true}
          />

          <ExpiryDateInput
            name="expiry"
            blank={this.state.blankInputs}
            label={dateLabel}
            handleChange={this.handleExpiryChange}
            showErrorMsgs={this.state.showErrorMsgs}
            handleEnterKeyDown={this.handleGiveBtnClick}
            smallerInput={true}
          />

          <EthAccountInput
            name="recipient"
            blank={this.state.blankInputs}
            label={"Enter the recipient's ETH address."}
            handleChange={this.handleRecipientChange}
            handleEnterKeyDown={this.handleGiveBtnClick}
            showErrorMsgs={this.state.showErrorMsgs}
            ownAddress={this.state.address}
            smallerInput={false}
          />

        <button 
          onClick={this.handleGiveBtnClick}
          class="pure-button button-success">
          Give
        </button>

      </fieldset>
    </div>
    )
  }
}
