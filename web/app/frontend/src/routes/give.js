import { h, Component } from 'preact'
import contract from 'truffle-contract'
import CaiShenContract from '../../../../../build/contracts/CaiShen.json';

import Web3Enabled from "../components/Web3Enabled.js";
import EthAmountInput from "../components/input/EthAmountInput.js";
import ExpiryDateInput from "../components/input/ExpiryDateInput.js";
import EthAccountInput from "../components/input/EthAccountInput.js";

var Web3 = require("web3");


export default class Give extends Web3Enabled{
  constructor(props){
    super(props);

    this.state = {
      address: null,
      balance: null,

      amount: "",
      expiry: "",
      recipient: "",

      validAmount: false,
      validExpiry: false,
      validRecipient: false,

      showErrorMsgs: false,
    }
  }


  componentWillMount = () => {
    if (typeof web3 !== "undefined") {
      this.setAccountData();
      this.setAccountDataInterval = setInterval(this.setAccountData, 1000);

      let meta = contract(CaiShenContract);
      meta.setProvider(web3.currentProvider);
      meta.deployed().then(instance => {
        this.caishen = instance;
      });
    }
  }


  setAccountData = () => {
    if (typeof web3 !== "undefined" && web3 != null){
      web3.eth.getAccounts((error, accounts) => {
        const address = accounts[0];
        if (web3.isAddress(address)){
          web3.eth.getBalance(address, (error, balance) => {
            this.setState({ address, balance });
          });
        }
      });
    }
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
      //this.caishen.give("0x414Ab7Cb9886f94D299df992f0bE9F0b30A6358E",
        //1517306495493,
        //{from: this.state.address, value: web3.toWei(this.state.amount, "ether")});
    }
    else {
      this.setState({ 
        showErrorMsgs: true,
      });
    }
  }


  renderUnlockedWeb3() {
    if (typeof web3 === "undefined" || web3 == null){
      return this.renderNoWeb3();
    }
    else if (this.state.balance == null){
      return this.renderLockedWeb3();
    }
    else{
      const balance = web3.fromWei(this.state.balance, "ether").toString();

      const dateLabel = (
        <span>
          Enter the earliest date for the recipient to claim the funds 
          (dd/mm/yyyy).<br />The expiry time will be midnight, 
          GMT+{(new Date().getTimezoneOffset() / 60 * -1).toString()}.
        </span>
      );

      return (
        <div class="give pure-form pure-form-stacked">
          <h1>Give a smart red packet</h1>
          <p>Your address: {this.state.address}</p>
          <p>Your balance: {balance}</p>

          <hr />

          <fieldset>
            <EthAmountInput 
              name="amount"
              label="Enter the amount of ETH to give."
              handleChange={this.handleAmountChange}
              showErrorMsgs={this.state.showErrorMsgs}
              maximum={this.state.balance}
              smallerInput={true}
            />

            <ExpiryDateInput
              name="expiry"
              label={dateLabel}
              handleChange={this.handleExpiryChange}
              showErrorMsgs={this.state.showErrorMsgs}
              smallerInput={true}
            />

            <EthAccountInput
              name="recipient"
              label={"Enter the recipient's ETH address."}
              handleChange={this.handleRecipientChange}
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
}
