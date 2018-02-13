import { h, Component } from 'preact'
import Web3Enabled from "../components/Web3Enabled.js";
import GiftSelect from "../components/redeem/GiftSelect.js";
import ContentBox from "../components/ContentBox.js";
var Web3 = require("web3");


export default class Redeem extends Web3Enabled{
  renderUnlockedWeb3() {
    return (
      <div class="redeem pure-form pure-form-stacked">
        <ContentBox isZh={this.props.isZh}>
          {this.props.isZh ?
            <h1>领取智能红包</h1>
            :
            <h1>Redeem your red packets</h1>
          }

          {this.renderAccountInfo()}

          <p>
            Please note that you will need a tiny amount of ETH (less than
            0.0001 ETH) to pay the transaction fee to redeem the finds.
          </p>


          <GiftSelect 
            isZh={this.props.isZh}
            renderNoWeb3={this.renderNoWeb3}
            caishen={this.props.caishen}
            address={this.props.address} />

        </ContentBox>
      </div>
    )
  }
}
