import { h, Component } from "preact"
var Web3 = require("web3");
import contract from 'truffle-contract'
import CaiShenContract from '../../../../../build/contracts/CaiShen.json';


export default class Web3Enabled extends Component{
  web3StatusCodes = {
    missing: 0,
    locked: 1,
    unlocked: 2
  }

  constructor(props){
    super(props);

    let wStatus = this.web3StatusCodes.missing;

    if (typeof web3 !== "undefined"){
      web3 = new Web3(web3.currentProvider);

      web3.eth.getAccounts((error, accounts) => {
        if (error){
          console.log("getAccounts error", error);
        }
        else{
          if (typeof accounts === "undefined" || accounts.length == 0) {
            wStatus = this.web3StatusCodes.locked;
          }
          else{
            wStatus = this.web3StatusCodes.unlocked;
          }
        }

        this.state = {
          web3Status: wStatus,
        }
      });
    }

  }

  renderAccountInfo = () => {
    return(
      <div class="account_info">
        <p>Your address: <pre>{this.state.address}</pre></p>
        <p>Your balance: <pre>{web3.fromWei(this.state.balance, "ether").toString()}</pre> ETH</p>
      </div>
    );
  }


  componentWillMount = () => {
    if (this.state.web3Status !== this.web3StatusCodes.missing){
      this.setAccountData();
      this.setAccountDataInterval = setInterval(this.setAccountData, 1000);

      let meta = contract(CaiShenContract);
      meta.setProvider(web3.currentProvider);
      meta.deployed().then(instance => {
        this.caishen = instance;
        window.caishen = instance;
      });
    }
  }

  componentWillUnmount = () => {
    if (this.setAccountDataInterval){
      clearInterval(this.setAccountDataInterval);
    }
  }

  setAccountData = () => {
    if (typeof web3 !== "undefined" && web3 != null){
      web3.eth.getAccounts((error, accounts) => {
        if (accounts != null && accounts.length > 0){
          const address = accounts[0];
          if (web3.isAddress(address)){
            web3.eth.getBalance(address, (error, balance) => {
              let web3Status = this.web3StatusCodes.unlocked;
              this.setState({ address, balance, web3Status });
            });
          }
        }
        else{
          this.setState({
            web3Status: this.web3StatusCodes.locked,
          });
        }
      });
    }
  }



  renderNoWeb3 = () => {
    return (
      <div>
        <p>To run this dApp, <a target="_blank" href="https://metamask.io/">install the MetaMask 
            extension</a> or visit this site in any web3-enabled browser.
        </p>
      </div>
    );
  }


  renderLockedWeb3 = () => {
    return (
      <div>
        <p>Please unlock MetaMask.</p>
      </div>
    );
  }


  render() {
    if (this.state.web3Status === this.web3StatusCodes.missing){
      return this.renderNoWeb3();
    }
    else if (this.state.web3Status === this.web3StatusCodes.locked){
      return this.renderLockedWeb3();
    }
    else if (this.state.web3Status === this.web3StatusCodes.unlocked){
      return this.renderUnlockedWeb3();
    }
  }
}
