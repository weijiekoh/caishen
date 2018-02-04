import { h, Component } from 'preact'

import { formatDate } from "../dates.js";
import Web3Enabled from "../components/Web3Enabled.js";
import EthAmountInput from "../components/input/EthAmountInput.js";
import ExpiryDateInput from "../components/input/ExpiryDateInput.js";
import EthAccountInput from "../components/input/EthAccountInput.js";
import PendingTransaction from "../components/PendingTransaction.js";
var Web3 = require("web3");


export default class Give extends Web3Enabled{
  constructor(props){
    super(props);

    this.filter = null;

    Object.assign(this.state, {
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

      changeCounter: 0,
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
      const recipientAddress = this.state.recipient;
      const amountWei = web3.toWei(this.state.amount, "ether");
      const expiry = this.state.expiry.getTime() / 1000;
      const payload = {
        value: amountWei,
        from: this.state.address
      };

      this.setState({ giveBtnClicked: true, }, () => {
        // Estimate gas
        this.props.caishen.give.estimateGas(recipientAddress, expiry, {value: amountWei})
        .then(gas => {
          payload.gas = gas;

          //console.log(recipientAddress, expiry, payload);
          this.props.caishen.give(recipientAddress, expiry, payload).then(tx => {
            //console.log("tx:", tx);

            let transactions = this.state.transactions;
            if (typeof transactions === "undefined"){
              transactions = [];
            }

            transactions.push({
              txHash: tx.receipt.transactionHash,
              txAmount: amountWei,
              txExpiry: new Date(expiry),
              txRecipient: recipientAddress,
            });
            return transactions;
          }).then(transactions => {
            this.setState({ 
              transactions: transactions,
              changeCounter: Math.random(),
              showErrorMsgs: false,
              giveBtnClicked: false,
              amount: "",
              expiry: "",
              recipient: "",
              validAmount: false,
              validExpiry: false,
              validRecipient: false,
            });
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
    if (!this.props.address || !this.props.caishen){
      return <p>Loading...</p>
    }

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
            changeCounter={this.state.changeCounter}
            label="Enter the amount of ETH to give."
            handleChange={this.handleAmountChange}
            showErrorMsgs={this.state.showErrorMsgs}
            handleEnterKeyDown={this.handleGiveBtnClick}
            maximum={this.props.balance}
            showFee={true}
            smallerInput={true}
          />

          <ExpiryDateInput
            name="expiry"
            changeCounter={this.state.changeCounter}
            label={dateLabel}
            handleChange={this.handleExpiryChange}
            showErrorMsgs={this.state.showErrorMsgs}
            handleEnterKeyDown={this.handleGiveBtnClick}
            smallerInput={true}
          />

          <EthAccountInput
            name="recipient"
            changeCounter={this.state.changeCounter}
            label={"Enter the recipient's ETH address."}
            handleChange={this.handleRecipientChange}
            handleEnterKeyDown={this.handleGiveBtnClick}
            showErrorMsgs={this.state.showErrorMsgs}
            notThisAddress={this.props.address}
            notThisAddressMsg={"The recipient address must not be your current address."}
            smallerInput={false}
          />

          {this.state.giveBtnClicked &&
            <PendingTransaction />
          }

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
