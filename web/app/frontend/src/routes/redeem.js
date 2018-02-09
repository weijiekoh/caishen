import { h, Component } from 'preact'

import Web3Enabled from "../components/Web3Enabled.js";

import GiftSelect from "../components/redeem/GiftSelect.js";

var Web3 = require("web3");


export default class Redeem extends Web3Enabled{
  renderUnlockedWeb3() {
    if (!this.props.address || !this.props.caishen){
      return this.renderPlsConnect();
    }

    return (
      <div class="redeem pure-form pure-form-stacked">
        <div class="textbox">
          <div class="textbox_inner">
            <h1>Redeem your red packets</h1>

            {this.renderAccountInfo()}

            <hr />

            <GiftSelect 
              renderNoWeb3={this.renderNoWeb3}
              caishen={this.props.caishen}
              address={this.props.address} />

          </div>
        </div>
      </div>
    )
  }
}
