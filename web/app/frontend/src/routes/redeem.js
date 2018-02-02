import { h, Component } from 'preact'

import Web3Enabled from "../components/Web3Enabled.js";
import EthAccountInput from "../components/input/EthAccountInput.js";

var Web3 = require("web3");


export default class Redeem extends Web3Enabled{
  constructor(props){
    super(props);
    Object.assign(this.state, {
      newRecipientValid: false,
      newRecipientAddress: false,
      showErrorMsgs: false,
    });
  }


  handleRedeemBtnClick = () => {
  }


  handleNewRecipientClick = () => {
    if (this.state.newRecipientValid){
    }
    else {
      this.setState({ 
        showErrorMsgs: true,
      });
    }
  }

  handleRedemptionAddressChange = (value, valid) => {
    this.setState({
      newRedeemAddress: value,
      newRedeemAddressValid: valid,
    });
  }

  handleNewRecipientChange = (value, valid) => {
    this.setState({
      newRecipientAddress: value,
      newRecipientValid: valid,
    });
  }


  renderUnlockedWeb3() {
    return (
      <div class="redeem pure-form pure-form-stacked">
        <h1>Redeem your red packets</h1>

        {this.renderAccountInfo()}

        <hr />

        <p>Your undreedemed red packets:</p>

        <button 
          onClick={this.handleRedeemBtnClick}
          class="pure-button button-success">
          Redeem funds
        </button>


        <hr />

        <h3>Change redemption address (advanced)</h3>
        <p>
          If your address is the recipient of a smart red packet, and you want
          to change the recipient to a different address, your MetaMask must be
          logged in to the original address.
        </p>

        <fieldset>

          <EthAccountInput
            name="change_recipient"
            label={"Enter the new recipient's ETH address."}
            handleChange={this.handleNewRecipientChange}
            showErrorMsgs={this.state.showErrorMsgs}
            ownAddress={this.state.address}
            smallerInput={false}
          />

          <button 
            disabled
            onClick={this.handleNewRecipientClick}
            class="pure-button button-primary">
            Change recipient
          </button>
        </fieldset>

        <hr />

        <h3>Return funds (advanced)</h3>
        <p>
          You may return a red packet to the giver at any time.
        </p>
        <fieldset>
          <button 
            onClick={this.handleReturnFundsClick}
            class="pure-button button-primary">
            Return funds
          </button>
        </fieldset>
      </div>
    )
  }
}
