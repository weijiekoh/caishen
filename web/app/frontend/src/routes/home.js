import { h, Component } from 'preact'
import { route } from "preact-router"; 
import About from "./about.js";
import ContentBox from "../components/ContentBox.js";


export default class Home extends Component{
  componentDidMount = () => {
    window.scrollTo(0, 0);
  }


  render() {
    return (
      <div class="home">
        <div class="landing">

          <div class="logo">
            <a href="#main">
              <img src="/static/images/logo.png" alt="CaiShen - Smart Red Packet 财神:智能红包" />
            </a>
          </div>
          <div class="chevron">
            <a href="#main">
              <img src="/static/images/chevron_down.png" />
            </a>
          </div>
        </div>

        <a class="main_anchor" name="main" />

        <div class="home_content">
          <ContentBox isZh={this.props.isZh}>
            <div class="concept">
              <img src="/static/images/concept.png" />
            </div>

            {this.props.isZh ?
              <div class="pure-u-1">
                <p>
                  这个农历新年，使用<strong>财神</strong>和您的亲朋好友共享财富未来！
                </p>
                <p>
                  财神红包如时间胶囊，接受人只有在指定日期之后才可以领取赠送的以太币金额。
                </p>
                <p>
                  例如，您赠送给他人一个以太币，并将领取日期设定为2020年1月1日。那么，该接受人只有在2020年1月1日之后才可以领取所收到的一个以太币。
                </p>
              </div>
                :
              <div class="pure-u-1">
                <p>
                  This Lunar New Year, share the future of finance with your loved ones.
                </p>
                <p>
                  Smart red packets can only be opened after a date you
                  specify. Like a time capsule, the recipient can only withdraw
                  the Ethereum funds after this date.
                </p>
                <p>
                  For example, if you give a red packet of 1 ETH and set the 
                  opening date to 1st January 2020, the recipient may only redeem the
                  funds on or after 1st January 2020.
                </p>
              </div>
            }

            <div class="requirements pure-u-1">
              {this.props.isZh ?
                <h2>使用须知</h2>
                  :
                <h2>What you need</h2>
              }
              {this.props.isZh ?
                <p>
                  为了方便使用<strong>财神</strong>，您需要：
                </p>
                  :
                <p>
                  To use CaiShen, you will need:
                </p>
              }
              {this.props.isZh ?
                <p>
                  <ul>
                    <li>
                      在电脑上使用Chrome或者Firefox浏览器，并安装 <a 
                        target="_blank" href="https://metamask.io/">
                        MetaMask digital wallet
                      </a>。
                    </li>
                    <li>
                      拥有足够的以太币金额。您可以从 <a 
                        href="https://www.coinbase.com" target="_blank">Coinbase</a>
                      或者 <a 
                        href="https://www.coinhako.com/" target="_blank">Coinhako</a>
                      上面购买以太币。
                    </li>
                    <li>
                      认真阅读<strong>财神</strong> <a target="_blank"
                        href="/about">FAQ</a>。若您忘记以太钱包密码，输入错误地址或者设定错误领取日期，我们将无法为您提供帮助。
                    </li>
                  </ul>
                </p>
                :
                <p>
                  <ul>
                    <li>
                      Chrome or Firefox on a desktop computer with the <a target="_blank"
                        href="https://metamask.io/">MetaMask digital wallet</a> installed.
                    </li>

                    <li>
                      Some Ethereum cryptocurrency. You may purchase Ethereum from <a
                        href="https://www.coinbase.com" target="_blank">Coinbase
                        </a> or <a href="https://www.coinhako.com/"
                        target="_blank">Coinhako</a>.
                    </li>
                    <li>
                      Read our <a href="/about" target="_blank">FAQ</a> carefully. We
                      will not be able to help you if you forget your wallet
                      password, send funds to the wrong address, or set a wrong the
                      withdrawal date, as everything takes place on the blockchain.
                    </li>
                  </ul>
                </p>
              }
            </div>

            <div class="pricing pure-u-1">
              {this.props.isZh ?
                  <h2>手续费用</h2>
                  :
                  <h2>Pricing</h2>
              }
              {About.renderFeeTable(this.props.isZh)}
            </div>

            <div class="terms pure-u-1">
              {this.props.isZh ?
                  <h2>附加条件</h2>
                  :
                  <h2>Terms and conditions</h2>
              }
              {this.props.isZh ?
                  <div>
                    <p>
<strong>财神</strong>科技使用的是以太坊区块链的智能合约技术。用户可以将一定数额的以太币用财神红包的形式赠出，并在指定日期之后领取。
                    </p>
                    <p>
<strong>财神</strong>不是金融机构，亦非支付平台，不能为您保管或处理赠出的财物。
                  </p>
                    <p>
                      <strong>财神</strong>的责任仅限于红包智能合约的设计，其他由以太坊本身的限制或个人操作导致的损失我们概不负责。
                    </p>
                  </div>
                  :
                  <div>
                    <p>
                      CaiShen is a tool which uses the Ethereum blockchain and smart
                      contract technology. It enables you to deposit Ethereum
                      cryptocurrency funds that can only be withdrawn after a
                      certain time using a specific private key.
                    </p>

                    <p>
                      CaiShen is not a financial institution as we do not store any of
                      your funds. Nor is it a payment processor as we do not process any
                      of your funds.
                    </p>

                    <p>
                      As such, CaiShen will not and cannot be responsible for the long term
                      viability of your funds or the eventual security of your funds. We
                      are and can only be responsible for the design of the smart contract.
                    </p>
                  </div>
              }
            </div>
          </ContentBox>
        </div>
      </div>
    );
  }
}
