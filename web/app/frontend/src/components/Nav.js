import { h, Component } from 'preact'
import { route } from "preact-router"; 

export default class Nav extends Component{
  render() {
    return (
      <nav class="nav">

        {!this.props.isHome &&
          <div class="logo">
            <a href="/">
              <img src="/static/images/logo.png" alt="CaiShen - Smart Red Packet 财神:智能红包" />
            </a>
          </div>
        }

        <div class="links desktop">
          <a href="/give">
            {this.props.isZh ?
              <img src="/static/images/give_btn_zh.png" alt="赠送" />
                :
              <img src="/static/images/give_btn.png" alt="Give" />
            }
          </a>
          <a href="/redeem">
            {this.props.isZh ?
              <img src="/static/images/redeem_btn_zh.png" alt="领取" />
              :
              <img src="/static/images/redeem_btn.png" alt="Redeem" />
            }
          </a>
          <a href="/about">
            {this.props.isZh ?
              <img src="/static/images/about_btn_zh.png" alt="了解" />
              :
              <img src="/static/images/about_btn.png" alt="About" />
            }
          </a>

          <a onClick={this.props.toggleLang}>
            {this.props.isZh ?
              <img src="/static/images/eng_btn.png" alt="English" />
              :
              <img src="/static/images/zh_btn.png" alt="中文" />
            }
          </a>
        </div>

        {this.props.isZh ?
          <div class="links mobile zh">
            <a href="/">
              <strong>财神</strong>
            </a>
            <a href="/give">赠送</a>
            <a href="/redeem">领取</a>
            <a href="/about">了解</a>
            <a onClick={this.props.toggleLang}>English</a>
          </div>
          :
          <div class="links mobile">
            <a href="/">
              <strong>CaiShen</strong>
            </a>
            <a href="/give">Give</a>
            <a href="/redeem">Redeem</a>
            <a href="/about">About</a>
            <a onClick={this.props.toggleLang}>中文</a>
          </div>

        }
      </nav>
    );
  }
}
