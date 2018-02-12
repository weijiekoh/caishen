import { h, Component } from 'preact'
import { Router, route } from "preact-router"; 

import Home from "./routes/home.js";
import Give from "./routes/give.js";
import Redeem from "./routes/redeem.js";
import ManualRedeem from "./routes/manual_redeem.js";
import About from "./routes/about.js";
import Nav from "./components/Nav.js";
import ContentBox from "./components/ContentBox.js";

var Web3 = require("web3");
import contract from 'truffle-contract'
import CaiShenContract from '../../../../build/contracts/CaiShen.json';


export default class App extends Component {
  web3StatusCodes = { missing: 0, locked: 1, unlocked: 2, wrongNet: 3 }

  constructor(props){
    super(props);

    let wStatus = this.web3StatusCodes.missing;
    const isHome = this.currentUrl === "/" || window.location.pathname === "/";

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

        this.state = {
          renderReady: true,
          web3Status: wStatus,
          isHome: isHome,
        }
      });
    }
    else{
      this.state = {
        renderReady: true,
        web3Status: this.web3StatusCodes.missing,
        isHome: isHome,
      };
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
      }).catch(err => {
        this.setState({
          web3Status: this.web3StatusCodes.wrongNet,
        });
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
    let lang = isZh ? "zh" : "en";

    try {
      if (typeof sessionStorage !== "undefined" && sessionStorage != null){
        if (!sessionStorage.getItem("lang") == null){
          lang = sessionStorage.getItem("lang");
        }
      }
    }
    catch (err) {
      console.error(err);
    }

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

  renderNoWeb3 = (title, isZh) => {
    const chromeUrl = "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn";
    const firefoxUrl = "https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/";

    return (
      <ContentBox isZh={isZh}>
        {title}

        {isZh ?
            <p>
              您需要在电脑上使用Chrome或者Firefox浏览器，并安装
              <a target="_blank" href="https://metamask.io/">
                MetaMask digital wallet
              </a>。
            </p>
            :
            <p>
              Please use Chrome or Firefox on a 
              computer with the <a target="_blank" href="https://metamask.io/">MetaMask
                digital wallet</a> installed.
            </p>

        }

        {isZh ?
            <p>
              基于以太坊系统的限制，财神目前还无法在移动系统上拥有最佳体验。
            </p>
            :
            <p>
              As Ethereum app ecosystem is still evolving, this website is best experienced
              on a desktop computer.
            </p>
        }

        <p>
          <a href={chromeUrl} target="_blank">
            <button class="pure-button button-success">
              {isZh ?
                "请装载谷歌Chrome版MetaMask"
                :
                "MetaMask for Google Chrome"
              }
            </button>
          </a>
        </p>
        <p>
          <a href={firefoxUrl} target="_blank">
            <button class="pure-button button-success">
              {isZh ?
                "请装载火狐Firefox版MetaMask"
                :
                "MetaMask for Mozilla Firefox"
              }
            </button>
          </a>
        </p>
      </ContentBox>
    );
  }


  renderLockedWeb3 = (title, isZh) => {
    return (
      <div>
        <Nav 
          toggleLang={this.toggleLang}
          isZh={isZh}
          isHome={this.state.isHome} />

        <ContentBox isZh={isZh}>
          {title}
          {isZh ?
            <p>请先打开MetaMask。</p>
            :
            <p>Please unlock MetaMask.</p>
          }
          <img src="/static/images/metamask_unlock.png" />
        </ContentBox>
      </div>
    );
  }


  toggleLang = () => {
    let lang = this.state.lang;
    if (typeof lang === "undefined"){
      try{
        if (typeof sessionStorage !== "undefined" && sessionStorage.getItem("lang")){
          lang = sessionStorage.getItem("lang");
        }
      }
      catch (err){
        console.error(err);
      }
    }

    if (lang === "zh"){
      lang = "en";
    }
    else{
      lang = "zh";
    }

    try{
      if (typeof sessionStorage !== "undefined" && sessionStorage != null){
        sessionStorage.setItem("lang", lang);
      }
    }
    catch (err){
      console.error(err);
    }

    this.setState({ lang });
  }


  render() {
    let footerTopMargin = 300;
    if (window.height > document.body.scrollHeight){
      footerTopMargin = window.height - document.body.scrollHeight;
    }

    let isZh = this.state.lang === "zh";

    try{
      if (typeof sessionStorage !== "undefined" && sessionStorage != null){
        isZh = sessionStorage.getItem("lang") === "zh";
      }
    }
    catch (err) {
      console.error(err);
    }

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
            renderReady={this.state.renderReady}
            enTitle="Give a smart red packet"
            zhTitle="赠送智能红包"
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
            renderReady={this.state.renderReady}
            enTitle="Redeem your red packets"
            zhTitle="领取智能红包"
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

      </div>
    );
  }
}
