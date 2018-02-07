import { h, Component } from 'preact'
import { Router, route } from "preact-router"; 
import { IntlProvider, Text } from 'preact-i18n';

import Home from "./routes/home.js";
import Give from "./routes/give.js";
import Redeem from "./routes/redeem.js";
import ManualRedeem from "./routes/manual_redeem.js";
import About from "./routes/about.js";
import Nav from "./components/Nav.js";

var Web3 = require("web3");
import contract from 'truffle-contract'
import CaiShenContract from '../../../../build/contracts/CaiShen.json';


export default class App extends Component {
  web3StatusCodes = { missing: 0, locked: 1, unlocked: 2 }

  constructor(props){
    super(props);

    let wStatus = this.web3StatusCodes.missing;

    if (typeof web3 !== "undefined"){
      web3 = new Web3(web3.currentProvider);

      web3.eth.getAccounts((error, accounts) => {
        if (error){
          console.error(error);
        }
        else{
          if (typeof accounts === "undefined" ||
              accounts == null || accounts.length == 0) {
            wStatus = this.web3StatusCodes.locked;
          }
          else{
            wStatus = this.web3StatusCodes.unlocked;
          }
        }

        this.state = { web3Status: wStatus, }
      });
    }
    else{
      this.state = { web3Status: wStatus, }
    }
  }


  componentWillMount = () => {
    if (this.state.web3Status !== this.web3StatusCodes.missing){
      this.setAccountData();
      // Don't set this interval because it interferes with the calendar
      // in gift.js
      //this.setAccountDataInterval = setInterval(this.setAccountData, 1000);

      let meta = contract(CaiShenContract);
      meta.setProvider(web3.currentProvider);

      meta.deployed().then(instance => {
        this.caishen = instance;
        window.caishen = instance;
        this.setState({ caishen: instance });
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
            web3.eth.defaultAccount = address;
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

	/** Gets fired when the route changes.
   *	@param {Object} event	"change" event from 
   *	[preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;

    // Update Google Analytics
    if (typeof window !== "undefined"){
      if (Object.keys(window).indexOf("ga") > -1 &&
          window.ga !== null){
        ga("set", "page", e.url);
        ga("send", "pageview");
      }
    }
	};

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
    let footerTopMargin = 300;
    if (window.height > document.body.scrollHeight){
      footerTopMargin = window.height - document.body.scrollHeight;
    }

    return (
      <div class="pure-g">
        <Nav />

        <hr />

        <Router onChange={this.handleRoute}>
          <Home path="/" />

          <Give 
            renderNoWeb3={this.renderNoWeb3}
            renderUnlockedWeb3={this.renderUnlockedWeb3}
            renderLockedWeb3={this.renderLockedWeb3}
            web3StatusCodes={this.web3StatusCodes}
            web3Status={this.state.web3Status}
            address={this.state.address}
            balance={this.state.balance}
            caishen={this.state.caishen}
            path="give" />

          <Redeem 
            renderNoWeb3={this.renderNoWeb3}
            renderUnlockedWeb3={this.renderUnlockedWeb3}
            renderLockedWeb3={this.renderLockedWeb3}
            web3StatusCodes={this.web3StatusCodes}
            web3Status={this.state.web3Status}
            address={this.state.address}
            balance={this.state.balance}
            caishen={this.state.caishen}
            path="redeem" />

          <About path="about/" />

          <ManualRedeem path="redeem/manual" />
        </Router>

        <div style={{ marginTop: footerTopMargin }} class="footer">
          <em>
            © CaiShen {new Date().getFullYear()}. Contact: weijie.koh [at] smarthongbao [dot] com
          </em>
        </div>
      </div>
    );
  }
}
