import { h, Component } from 'preact'

export default class Nav extends Component{
  render() {
    return (
      <div class="nav pure-u-1">
        <nav>
          <a href="/">
            <div class="logo">
              <div class="en">CaiShen - Smart Red Packet</div>
              <div class="zh">财神 - 智能红包</div>
            </div>
          </a>
          <div class="links">
            <a href="/deposit">Deposit</a>
            <a href="/redeem">Redeem</a>
            <a href="/about">About</a>
          </div>
        </nav>
      </div>
    );
  }
}
