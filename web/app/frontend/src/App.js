import { h, Component } from 'preact'
import { Router, route } from "preact-router"; 

import Home from "./routes/home.js";
var Web3 = require("web3");


export default class App extends Component {
  constructor(props){
    super(props);
    if (typeof web3 === 'undefined') {
      this.web3 = null;
    } 
    else {
      this.web3 = new Web3(web3.currentProvider);
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
      <p>Please install MetaMask.</p>
    );
  }


  render() {
    if (this.web3 == null){
      return (this.renderNoWeb3());
    }

    const router = (
      <Router onChange={this.handleRoute}>
        <Home path="/" />
      </Router>
    );

    return (
      <div class="pure-g">
        <div class="pure-u-1">
          {this.web3 == null ?
              this.renderNoWeb3()
              :
              router
          }
        </div>
      </div>
    );
  }
}


