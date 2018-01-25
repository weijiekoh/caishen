import { h, Component } from 'preact'
var Web3 = require("web3");

export default class Web3Enabled extends Component{
  constructor(props){
    super(props);
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
    if (web3 == null){
      return this.renderNoWeb3();
    }
    else if (web3.eth.accounts.length === 0){
      return this.renderLockedWeb3();
    }
    else{
      return this.renderUnlockedWeb3();
    }
  }
}
