import { h, Component } from 'preact'

export default class Nav extends Component{
  render() {
    return (
      <nav class="nav">

        {!this.props.isHome &&
          <div class="logo">
            <img src="/static/images/logo.png" alt="CaiShen - Smart Red Packet 财神:智能红包" />
          </div>
        }

        <div class="links desktop">
          <a href="/give">
            <img src="/static/images/give_btn.png" alt="Give 赠送" />
          </a>
          <a href="/redeem">
            <img src="/static/images/redeem_btn.png" alt="Redeem 赎回" />
          </a>
          <a href="/about">
            <img src="/static/images/about_btn.png" alt="Learn more 了解" />
          </a>
        </div>

        <div class="links mobile">
          <a href="/give"> Give </a>
          <a href="/redeem"> Redeem </a>
          <a href="/about"> Learn more </a>
          <a href="/">中文</a>
        </div>
      </nav>
    );
  }
}
