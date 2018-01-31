import { h, Component } from 'preact'
import Web3Enabled from "../components/Web3Enabled.js";
var Web3 = require("web3");


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


  renderUnlockedWeb3() {
    return (
      <div class="redeem pure-form pure-form-stacked">
        <h1>Redeem funds</h1>
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
            Enter the ETH address of the new recipient.
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
            To confirm this, enter your ETH address.
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
