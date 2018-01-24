import {h, Component} from 'preact'
import { Router, route } from "preact-router"; 
import "preact/devtools";
import "./styles/index.less";

export default class App extends Component {
	/** Gets fired when the route changes.
   *	@param {Object} event	"change" event from 
   *	[preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;

    // Update Google Analytics
    if (typeof window !== "undefined"){
      if (window.ga !== null){
        ga("set", "page", e.url);
        ga("send", "pageview");
      }
    }
	};


  render() {
    return (
      <div>
        <p>Hello, world</p>
      </div>
    );
  }
}
