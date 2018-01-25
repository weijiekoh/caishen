import { h, Component } from 'preact'

export default class Nav extends Component{
  render() {
    return (
      <div class="nav pure-u-1">
        <nav>
          <a href="/">
            <div class="logo pure-u-1">
              <div class="en">CaiShen - Smart Red Packet</div>
              <div class="zh">财神 - 智能红包</div>
            </div>
          </a>
          <div class="links pure-u-1">
            <a href="/give">Give 赠送</a>
            <a href="/redeem">Redeem 赎回</a>
            <a href="/about">Learn more 了解</a>
          </div>
        </nav>
      </div>
    );
  }
}
