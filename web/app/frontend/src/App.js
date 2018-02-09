import { h, Component } from 'preact'
import { Router, route } from "preact-router"; 

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

        this.state = { web3Status: wStatus, isHome: true,}
      });
    }
    else{
      this.state = { web3Status: wStatus, isHome: true,}
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

    if (this.currentUrl === "/" || window.location.pathname === "/"){
      this.setState({
        isHome: true
      });
    }

    const isZh = window.document.getElementsByTagName("html")[0]
                   .getAttribute("lang") === "zh" ||
                 window.location.hash === "#zh";
    const lang = isZh ? "zh" : "en";
    console.log(lang);
    this.setState({ lang });

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
    if (this.currentUrl === "/"){
      this.setState({
        isHome: true,
      });
    }
    else{
      this.setState({
        isHome: false,
      });
    }

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
        <p>
          To give a smart red packet, please use Chrome or Firefox on a desktop
      computer with the <a target="_blank" href="https://metamask.io/">MetaMask
        digital wallet</a> installed.</p>
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


  toggleLang = () => {
    let lang = this.state.lang;
    if (lang === "zh"){
      lang = "en";
    }
    else{
      lang = "zh";
    }
    this.setState({ lang });
  }

  render() {
    let footerTopMargin = 300;
    if (window.height > document.body.scrollHeight){
      footerTopMargin = window.height - document.body.scrollHeight;
    }

    const isZh = this.state.lang === "zh";

    return (
      <div>
        <Nav 
          toggleLang={this.toggleLang}
          isZh={isZh}
          isHome={this.state.isHome} />

        <Router onChange={this.handleRoute}>
          <Home 
            isZh={isZh}
            path="/" />

          <Give 
            isZh={isZh}
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
            isZh={isZh}
            renderNoWeb3={this.renderNoWeb3}
            renderUnlockedWeb3={this.renderUnlockedWeb3}
            renderLockedWeb3={this.renderLockedWeb3}
            web3StatusCodes={this.web3StatusCodes}
            web3Status={this.state.web3Status}
            address={this.state.address}
            balance={this.state.balance}
            caishen={this.state.caishen}
            path="redeem" />

          <About 
            isZh={isZh}
            path="about/" />

          <ManualRedeem 
            isZh={isZh}
            path="redeem/manual" />
        </Router>

        {/*
        */}
      </div>
    );
  }
}
