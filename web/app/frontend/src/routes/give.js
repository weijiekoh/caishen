import { h, Component } from 'preact'
import Web3Enabled from "../components/Web3Enabled.js";
import contract from 'truffle-contract'
import CaiShenContract from '../../../../../build/contracts/CaiShen.json';

import EthAmountInput from "../components/input/EthAmountInput.js";
import ExpiryDateInput from "../components/input/ExpiryDateInput.js";
import EthAccountInput from "../components/input/EthAccountInput.js";

var Web3 = require("web3");

export default class Give extends Web3Enabled{
  constructor(props){
    super(props);
    let address;

    this.state = {
      amount: "",
      expiry: "",
      recipient: "",
      validAmount: false,
      validExpiry: false,
      validRecipient: false,
      invalidMsg: "",
      showErrorMsg: false,
      address: null,
      balance: null,
    }
  }


  componentWillMount = () => {
    this.setAccountData();
    this.setAccountDataInterval = setInterval(this.setAccountData, 1000);

    let meta = contract(CaiShenContract);
    meta.setProvider(web3.currentProvider);
    meta.deployed().then(instance => {
      this.caishen = instance;
    });
  }


  setAccountData = () => {
    if (typeof web3 !== "undefined" && web3 != null){
      web3.eth.getAccounts((error, accounts) => {
        const address = accounts[0];

        web3.eth.getBalance(address, (error, balance) => {
          this.setState({ address, balance });
        });

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
        invalidMsg: "Please enter valid data.",
        showErrorMsg: true,
      });
    }
  }


  renderUnlockedWeb3() {
    if (this.state.balance == null){
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
              showErrorMsg={this.state.showErrorMsg}
              maximum={this.state.balance}
              smallerInput={true}
            />

            <ExpiryDateInput
              name="expiry"
              label={dateLabel}
              handleChange={this.handleExpiryChange}
              showErrorMsg={this.state.showErrorMsg}
              smallerInput={true}
            />

            <EthAccountInput
              name="recipient"
              label={"Enter the recipient's ETH address."}
              handleChange={this.handleRecipientChange}
              showErrorMsg={this.state.showErrorMsg}
              ownAddress={this.state.address}
              smallerInput={false}
            />

            <p class="error">
              {this.state.invalidMsg}
            </p>

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
