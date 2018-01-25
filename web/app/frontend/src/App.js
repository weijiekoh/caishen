import { h, Component } from 'preact'
import { Router, route } from "preact-router"; 

import Home from "./routes/home.js";
import Deposit from "./routes/deposit.js";
import Redeem from "./routes/redeem.js";
import About from "./routes/about.js";
import Nav from "./components/Nav.js";

var Web3 = require("web3");


export default class App extends Component {
  constructor(props){
    super(props);
    if (typeof web3 === 'undefined') {
      this.web3 = null;
    } 
    else {
      this.web3 = new Web3(web3.currentProvider);
      console.log(web3.eth.coinbase);
    }

    this.state = {
      web3: this.web3
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
      <div class="noweb3 pure-u-2-6">
        <p>To run this dApp, <a href="https://metamask.io/">install the MetaMask 
            extension</a> or visit this site in any web3-enabled browser.
        </p>
      </div>
    );
  }


  renderLockedWeb3 = () => {
    return (
      <div class="noweb3 pure-u-2-6">
        <p>Please unlock MetaMask to continue.</p>
      </div>
    );
  }


  render() {
    return (
      <div class="pure-g">
        <Nav />

        <Router onChange={this.handleRoute}>
          <Home path="/" />
          <Deposit path="deposit/" />
          <Redeem path="redeem/" />
          <About path="about/" />
        </Router>
      </div>
    );
  }
}


