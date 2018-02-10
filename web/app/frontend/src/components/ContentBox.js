import { h, Component } from 'preact'
import Footer from "./Footer.js";

export default class ContentBox extends Component{
  render() {
    return (
      <div class="contentbox">
        <div class="contentbox_inner">
          {this.props.children}
          <Footer isZh={this.props.isZh} />
        </div>
      </div>
    );
  }
}
