import { h, Component } from 'preact'
import Web3Enabled from "../components/Web3Enabled.js";
var Web3 = require("web3");

export default class Give extends Web3Enabled{
  constructor(props){
    super(props);
    let address;

    this.state = {
      amount: "",
      expiry: "",
      valid: false,
      address: null,
      balance: null,
    }

  }


  componentWillMount = () => {
    this.setAccountData();
    this.setAccountDataInterval = setInterval(this.setAccountData, 1000);
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


  validateInputs = () => {
    const valid = this.validateAmount(this.state.amount) &&
      this.validateExpiry(this.state.expiry);
    this.setState({ valid });
  }

  validateAmount = amount => {
    try{
      web3.fromDecimal(amount);
      return true;
    }
    catch(err){
      return false;
    }
  }

  validateExpiry = expiry => {
    try{
      const sp = expiry.trim().split("/");
      if (sp.length !== 3) throw "Wrong date format";
      if (sp[0].length > 2 || sp[0].length === 0) throw "Wrong day format";
      if (sp[1].length > 2 || sp[1].length === 0) throw "Wrong month format";
      if (sp[2].length !== 4) throw "Wrong year format";

      const day = parseInt(sp[0], 10);
      const month = parseInt(sp[1], 10);
      const year = parseInt(sp[2], 10);

      if ([day, month, year].some(isNaN)) throw "NaN";
      if (day > 31 || day < 1) throw "Invalid day";
      if (month > 12 || month < 1) throw "Invalid month";
      if (year < (new Date()).getFullYear()) throw "Invalid year";

      if ([4, 6, 9, 11].some(x => x === month)){
        if (day > 30) throw "Invalid day";
      }
      if (month == 2){
        if (new Date(year, 1, 29).getDate() === 29){
          if (day > 29) throw "Invalid day due to leap year";
        }
        else{
          if (day > 28) throw "Invalid day due to leap year";
        }
      }

      // Validate using unix time conversion and parsing
      const p = new Date(new Date(year, month-1, day).getTime());
      if (year !== p.getFullYear()) throw "Invalid year";
      if (month !== p.getMonth() + 1) throw "Invalid month";
      if (day !== p.getDate()) throw "Invalid day";

      return true;
    }
    catch(err){
      return false;
    }
  }


  handleAmountChange = e => {
    const amount = e.target.value;
    this.setState({ amount }, () => {
      this.validateInputs();
    });
  }


  handleExpiryChange = e => {
    const expiry = e.target.value;
    this.setState({ expiry }, () => {
      this.validateInputs();
    });
  }


  handleGiveBtnClick = () => {
  }


  renderUnlockedWeb3() {
    if (this.state.balance == null){
      return this.renderLockedWeb3();
    }
    else{
      const balance = web3.fromWei(this.state.balance, "ether").toString();
      return (
        <div class="give pure-form pure-form-stacked">
          <h1>Give a smart red packet</h1>
          <p>Your address: {this.state.address}</p>
          <p>Your balance: {balance}</p>
          <fieldset>
            <label for="amount">Enter the amount of ETH to give.</label>
            <input
              onChange={this.handleAmountChange}
              onKeyUp={this.handleAmountChange}
              value={this.state.amount} name="amount" type="text" min="0" />

            <label for="expiry">
              Enter the earliest date for the recipient to claim the funds
              (dd/mm/yyyy).
              Timezone: {"UTC+" + (new Date().getTimezoneOffset() / 60 * -1).toString()}.
            </label>
            <input 
              onChange={this.handleExpiryChange}
              onKeyUp={this.handleExpiryChange}
              value={this.state.expiry} name="expiry" type="text" placehodler="dd/mm/yyyy" />

            {this.state.valid ?
              <button 
                onClick={this.handleGiveBtnClick}
                class="pure-button button-success">
                Give
              </button>
                :
              <button 
                disabled
                onClick={this.handleGiveBtnClick}
                class="pure-button button-success">
                Give
              </button>
            }
          </fieldset>
        </div>
      )
    }
  }
}
