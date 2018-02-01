import { h, Component } from "preact"
var Web3 = require("web3");


export default class Web3Enabled extends Component{
  constructor(props){
    super(props);
    if (typeof web3 !== "undefined") {
        web3 = new Web3(web3.currentProvider);
    }
    //else {
      //window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    //}
    //
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
    return this.renderUnlockedWeb3();
  }
}
