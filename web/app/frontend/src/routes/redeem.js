import { h, Component } from 'preact'

import Web3Enabled from "../components/Web3Enabled.js";

import GiftSelect from "../components/redeem/GiftSelect.js";

var Web3 = require("web3");


export default class Redeem extends Web3Enabled{
  renderUnlockedWeb3() {
    return (
      <div class="redeem pure-form pure-form-stacked">
        <h1>Redeem your red packets</h1>

        {this.renderAccountInfo()}

        <hr />

        <GiftSelect 
          caishen={this.caishen}
          address={this.state.address} />

      </div>
    )
  }
}
