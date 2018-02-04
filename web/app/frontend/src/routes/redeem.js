import { h, Component } from 'preact'

import Web3Enabled from "../components/Web3Enabled.js";

import GiftSelect from "../components/redeem/GiftSelect.js";

var Web3 = require("web3");


export default class Redeem extends Web3Enabled{
  renderUnlockedWeb3() {
    if (!this.props.address || !this.props.caishen){
      return <p>Loading...</p>
    }
    return (
      <div class="redeem pure-form pure-form-stacked">
        <h1>Redeem your red packets</h1>

        {this.renderAccountInfo()}

        <hr />

        <GiftSelect 
          renderNoWeb3={this.renderNoWeb3}
          caishen={this.props.caishen}
          address={this.props.address} />

      </div>
    )
  }
}
