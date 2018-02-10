import { h, Component } from 'preact'
import Web3Enabled from "../components/Web3Enabled.js";
import GiftSelect from "../components/redeem/GiftSelect.js";
import ContentBox from "../components/ContentBox.js";
var Web3 = require("web3");


export default class Redeem extends Web3Enabled{
  renderUnlockedWeb3() {
    if (!this.props.address || !this.props.caishen){
      return this.renderPlsConnect();
    }

    return (
      <div class="redeem pure-form pure-form-stacked">
        <ContentBox isZh={this.props.isZh}>
          {this.props.isZh ?
            <h1>领取智能红包</h1>
            :
            <h1>Redeem your red packets</h1>
          }

          {this.renderAccountInfo()}

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
