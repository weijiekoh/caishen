import { h, Component } from 'preact'
import Web3Enabled from "../components/Web3Enabled.js";
var Web3 = require("web3");
//const checkAddressChecksum = function (address) {
    //// Check each case
    //address = address.replace(/^0x/i,'');
    //var addressHash = sha3(address.toLowerCase()).replace(/^0x/i,'');

    //for (var i = 0; i < 40; i++ ) {
        //// the nth letter should be uppercase if the nth digit of casemap is 1
      //if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) ||
          //(parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
            //return false;
        //}
    //}
    //return true;
//};


//const isAddress = address => {
    //// check if it has the basic requirements of an address
    //if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        //return false;
        //// If it's ALL lowercase or ALL upppercase
    //} else if (/^(0x|0X)?[0-9a-f]{40}$/.test(address) || /^(0x|0X)?[0-9A-F]{40}$/.test(address)) {
        //return true;
        //// Otherwise check each case
    //} else {
        //return checkAddressChecksum(address);
    //}
//};


export default class Redeem extends Web3Enabled{
  constructor(props){
    super(props);
    this.state = {
      address: "",
      valid: false,
    };
  }


  handleRedeemBtnClick = () => {
  }


  handleAddressChange = e => {
    const address = e.target.value;
    this.setState({ address: address }, () => {
      this.validateInputs();
    });
  }


  validateInputs = () => {
    let valid = false;

    if (this.state.address.length > 0){
      valid = true;
    }
    //valid = isAddress(this.state.address);

    this.setState({ valid });
  }


  renderUnlockedWeb3() {
    return (
      <div class="redeem pure-form pure-form-stacked">
        <h2>Redeem funds</h2>
        <fieldset>
          <label for="address">Enter your ETH address.</label>
          <input 
            onKeyUp={this.handleAddressChange}
            value={this.state.address}
            name="address" type="text" />
          {this.state.valid ?
            <button 
              onClick={this.handleRedeemBtnClick}
              class="pure-button button-success">
              Redeem funds
            </button>
            :
            <button 
              disabled
              onClick={this.handleRedeemBtnClick}
              class="pure-button button-success">
              Redeem funds
            </button>
          }
        </fieldset>

        <hr />

        <h3>Change redemption address (advanced)</h3>
        <p>
          If your address is the recipient of a smart red packet, and you want
          to change the recipient to a different address, your MetaMask must be
          logged in to the original address.
        </p>
        <fieldset>
          <label for="change_address">
            Enter the ETH address of the new recipient and click "Change recipient".
          </label>
          <input 
            name="change_address" type="text" />
          <button 
            disabled
            class="pure-button button-primary">
            Change recipient
          </button>
        </fieldset>

        <hr />

        <h3>Return funds (advanced)</h3>
        <p>If someone gave a smart red packet to your address, and you want to
          return the funds to them, your MetaMask must be logged into the
          recipient address they specified.</p>
        <fieldset>
          <label for="return_address">
            To confirm this, enter your ETH address and click "Return funds".
          </label>
          <input 
            name="return_address" type="text" />
          <button 
            disabled
            class="pure-button button-primary">
            Return funds
          </button>
        </fieldset>
      </div>
    )
  }
}
