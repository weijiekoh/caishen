import { h, Component } from "preact"
import { Web3Provider } from "react-web3";
var Web3 = require("web3");


export default class Web3Enabled extends Component{
  constructor(props){
    super(props);
    if (typeof web3 !== "undefined") {
        web3 = new Web3(web3.currentProvider);
    }
    else {
      web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
  }


  renderNoWeb3 = () => {
    return (
      <div>
        <p>To run this dApp, <a href="https://metamask.io/">install the MetaMask 
            extension</a> or visit this site in any web3-enabled browser.
        </p>
      </div>
    );
  }


  renderLockedWeb3 = () => {
    return (
      <div>
        <p>Please unlock MetaMask and refresh this page.</p>
      </div>
    );
  }


  render() {
    return (
      <Web3Provider
        web3UnavailableScreen={this.renderNoWeb3}
        accountUnavailableScreen={this.renderLockedWeb3}>

        {this.renderUnlockedWeb3()}

      </Web3Provider>
    );
  }
}
