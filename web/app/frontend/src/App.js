import { h, Component } from 'preact'
import { Router, route } from "preact-router"; 

import Home from "./routes/home.js";
import Give from "./routes/give.js";
import Redeem from "./routes/redeem.js";
import About from "./routes/about.js";
import Nav from "./components/Nav.js";


export default class App extends Component {
  componentWillMount = () => {
    if (typeof web3 !== 'undefined') {
      web3 = new Web3(web3.currentProvider);

      if (web3.eth.accounts.length === 0){
        web3 = new Web3(web3.currentProvider);
      }
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


  render() {
    return (
      <div class="pure-g">
        <Nav />

        <hr />

        <Router onChange={this.handleRoute}>
          <Home path="/" />
          <Give path="give" />
          <Redeem path="redeem" />
          <About path="about/" />
        </Router>
      </div>
    );
  }
}


