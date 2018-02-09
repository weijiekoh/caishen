import { h, Component } from 'preact'

import { formatDate } from "../dates.js";
import Web3Enabled from "../components/Web3Enabled.js";
import EthAmountInput from "../components/input/EthAmountInput.js";
import ExpiryDateInput from "../components/input/ExpiryDateInput.js";
import EthAccountInput from "../components/input/EthAccountInput.js";
import ShortTextInput from "../components/input/ShortTextInput.js";
import LongTextInput from "../components/input/LongTextInput.js";
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
      giverName: "",
      message: "",

      validAmount: false,
      validExpiry: false,
      validRecipient: false,
      validGiverName: true,
      validMessage: true,

      showErrorMsgs: false,
      showForm: true,

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
      expiry: value,
      validExpiry: valid,
    });
  }


  handleGiverNameChange = (value, valid)  => {
    this.setState({ 
      giverName: value,
      validGiverName: valid,
    });
  }


  handleMessageChange = (value, valid) => {
    this.setState({ 
      message: value,
      validMessage: valid,
    });
  }


  handleGiveBtnClick = () => {
    const valid = this.state.validAmount &&
      this.state.validRecipient &&
      this.state.validExpiry &&
      this.state.validGiverName &&
      this.state.validMessage;

    if (valid){
      const recipientAddress = this.state.recipient;
      const amountWei = web3.toWei(this.state.amount, "ether");
      const expiry = this.state.expiry.getTime() / 1000;
      const giverName = this.state.giverName.trim();
      const message = this.state.message.trim()

      const payload = {
        value: amountWei,
        from: this.state.address
      };

      this.setState({ btnClicked: true, showForm: false, }, () => {
        // Estimate gas
        this.props.caishen.give.estimateGas(
          recipientAddress,expiry, giverName, message, {value: amountWei})
        .then(gas => {
          payload.gas = gas;

          this.props.caishen.give(
            recipientAddress, expiry, giverName, message, payload).then(tx => {

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

            this.setState({ 
              transactions: transactions,
              changeCounter: Math.random(),
              showErrorMsgs: false,
              btnClicked: false,
              amount: "",
              expiry: "",
              recipient: "",
              validAmount: false,
              validExpiry: false,
              validRecipient: false,
            });
          }).catch(err => {
            this.setState({ 
              transactions: [],
              btnClicked: false,
              showForm: true,
              showErrorMsgs: false,
              changeCounter: Math.random(),
              amount: "",
              expiry: "",
              recipient: "",
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
    const networkId = web3.version.network;
    let url = "https://etherscan.io/tx/"
    if (networkId === "3"){
      url = "https://ropsten.etherscan.io/tx/";
    }
    return transactions.map((transaction, i) => 
      <div class="transaction_success">
        <em class="success">Red packet sent.</em>
        <p>The owner of the ETH address </p>
        <p><pre>{transaction.txRecipient}</pre></p>
        <p>
          may redeem {web3.fromWei(transaction.txAmount)} ETH after 
          midnight, {formatDate(transaction.txExpiry)}.
        </p>
        <p>
          <a target="_blank" href={url + transaction.txHash}>
            Click here
          </a> to 
          view the transaction details.
        </p>
        <hr />
      </div>
    );
  }


  renderUnlockedWeb3() {
    if (!this.props.address || !this.props.caishen){
      return this.renderPlsConnect();
    }

    const offset = new Date().getTimezoneOffset();
    const minutes = Math.abs(offset);
    const hours = Math.floor(minutes / 60);
    const prefix = offset < 0 ? "+" : "-";
    const timezone = prefix + hours;

    const dateLabel = "Select the earliest date for the recipient to claim the funds. The opening time will be set as midnight, GMT" + timezone + ".";

    return (
      <div class="give pure-form pure-form-stacked">
          <div class="textbox">
            <div class="textbox_inner">
              <h1>Give a smart red packet</h1>
              {this.renderAccountInfo()}

              <hr />

              {this.state.transactions && this.state.transactions.length > 0 &&
                this.renderTransactions(this.state.transactions)}

              {this.state.showForm &&
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

                  <ExpiryDateInput
                    name="expiry"
                    changeCounter={this.state.changeCounter}
                    label={dateLabel}
                    handleChange={this.handleExpiryChange}
                    showErrorMsgs={this.state.showErrorMsgs}
                  />

                  <ShortTextInput
                    name="giver_name"
                    changeCounter={this.state.changeCounter}
                    label={"Optional: Enter your name."}
                    handleChange={this.handleGiverNameChange}
                    handleEnterKeyDown={this.handleGiverNameChange}
                    showErrorMsgs={this.state.showErrorMsgs}
                    maxLength={60}
                  />

                  <LongTextInput
                    name="giver_msg"
                    changeCounter={this.state.changeCounter}
                    label={"Optional: Enter a short message for the recipient."}
                    handleChange={this.handleMessageChange}
                    handleEnterKeyDown={this.handleMessageChange}
                    showErrorMsgs={this.state.showErrorMsgs}
                    maxLength={140}
                  />

                  <p>
                    <em>
                      Please note that the information you enter above will be stored
                      on the blockchain and can be seen by anyone.
                    </em>
                  </p>

                </fieldset>
              }

              {this.state.btnClicked && <PendingTransaction /> }

              {this.state.showForm &&
                <button 
                  onClick={this.handleGiveBtnClick}
                  class="pure-button button-success">
                  Give
                </button>
              }

            </div>
          </div>
      </div>
    );
  }
}
