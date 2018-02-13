import { h, Component } from 'preact'
import ContentBox from "../components/ContentBox.js";

export default class About extends Component{
  componentDidMount = () => {
    window.scrollTo(0, 0);
  }

  static renderFeeTable = isZh => {
    if (isZh){
      return (
        <div>
          <table class="pure-table pure-table-bordered">
            <thead>
              <tr>
                <th>赠送红包金额</th>
                <th>一次性收费</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>0.01以太币或更少</td>
                <td>0%</td>
              </tr>
              <tr>
                <td>多于0.01以太币</td>
                <td>1%</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }


    return (
      <div>
        <table class="pure-table pure-table-bordered">
          <thead>
            <tr>
              <th>Amount</th>
              <th>One-time fee</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0.01 ETH and below</td>
              <td>0%</td>
            </tr>
            <tr>
              <td>Above 0.01 ETH</td>
              <td>1%</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }


  render() {
    return (
      <div class="about">
        <ContentBox isZh={this.props.isZh}>
          {this.props.isZh ?
            <h2>财神技术详情</h2>
            :
            <h2>The technology behind CaiShen</h2>
          }

          {this.props.isZh ?
            <div>
              <p>
<strong>财神</strong>是基于以太坊智能合约技术的应用。智能合约是在区块链上面运行的计算机执行程序，可以准确执行命令，并不受制于任何权威及平台。
              </p>
              <p>
<strong>财神</strong>智能合约规定领取红包金额只能在指定日期之后进行。比如，您将领取日期设定为2020年1月1日，那么，接受人只有在2020年1月1日之后才可以领取收到的金额。
              </p>
              <p>
                您所看到的网页是一个分布式应用（英文称dApp）。而<strong>财神</strong>最核心的智能合约则存在于区块链技术上面。这就意味着即使财神的网站或团队不复存在，您的红包将依然长存。
              </p>
            </div>
              :
            <div>
              <p>
                CaiShen is based upon Ethereum smart contract technology. A
                smart contract is a computer program that runs on the
                blockchain. A smart contract will execute the instructions
                encoded precisely, and without censorship, all without
                requiring a trusted intermediary.
              </p>

              <p>
                The CaiShen smart contract is programmed to only allow a red
                packet to be redeemed on or after the opening date.  For
                example, if you set the opening date to 1st January 2020, the
                recipient of the red packet can only redeem the funds on or
                after 1st January 2020.
              </p>

              <p>
                The website you are seeing right now is is a dApp (“distributed
                application”). Only this user interface lives on our servers.
                However, the smart contract — the heart of the application —
                resides on the Ethereum blockchain. This means that even when
                this website, or ourselves, cease to exist, the assets and
                functionality of CaiShen will remain safe.
              </p>
            </div>
          }

          {this.props.isZh ?
            <h2>财神团队</h2>
            :
            <h2>The CaiShen team</h2>
          }

          <ul>
            <li>Koh Wei Jie</li>
            <li>Kelvin Quee</li>
            <li>Rohan Naidu</li>
            <li>Muhd Amrullah</li>
          </ul>

          {this.props.isZh ?
            <h2>平面设计</h2>
            :
            <h2>Web and graphic design</h2>
          }
          <p>
            Janel Ang ({this.props.isZh ?
              <a target="_blank" href="http://angjanel.wixsite.com/sunflakes">作品集</a>
              :
              <a target="_blank" href="http://angjanel.wixsite.com/sunflakes">portfolio</a>
            })

          </p>

          <a name="fees" />
          {this.props.isZh ?
            <h2>手续费用</h2>
              :
            <h2>Pricing</h2>
          }

          {this.props.isZh ?
            <p>
我们致力于为您提供质优价廉的服务，财神所收取费用仅会用在日常运营和智能合约制订的开销上面。
            </p>
            :
            <p>
              The fees for using this smart contract are very modest and will be
              used to cover hosting and contract deployment costs.
            </p>
          }

          {this.constructor.renderFeeTable(this.props.isZh)}

          {this.props.isZh ?
            <h2>常见问题</h2>
            :
            <h2>Frequently asked questions</h2>
          }

          {this.props.isZh ?
            <h3>什么是红包？</h3>
            :
            <h3>What is a red packet?</h3>
          }

          {this.props.isZh ?
            <p>
红包是重要节庆活动时长辈给晚辈赠送的钱物，通常使用红纸包裹代表吉祥。更多关于红包的信息可以在<a href="https://zh.wikipedia.org/wiki/%E7%B4%85%E5%8C%85" target="_blank">维基百科</a>找到。
            </p>
            :
            <p>
              In some Asian cultures, it is customary on some occasions for
              elders to give packets of money to unmarried or younger
              relatives. More information about this tradition can be found <a
                href="https://en.wikipedia.org/wiki/Red_envelope">on Wikipedia</a>.
            </p>
          }

          {this.props.isZh ?
            <h3>何为“智能”红包？</h3>
              :
            <h3>Why are these red packets "smart"?</h3>
          }

          {this.props.isZh ?
            <div>
              <p>
以太坊的智能合约使得制定交易规则变为可能。合约的条款可以由专业人员为您定制，无须任何中介或权威机构允许。欲了解更多有关智能合约，请浏览<a href="https://www.ethereum.org/" target="_blank">以太币网站</a>。
              </p>
              <p>
                <strong>财神</strong>
就是这样的一个智能合约。它通过设计计算机程序，规定指定接受人只能在指定日期之后才能接受红包金额。
              </p>
            </div>
            :
            <div>
              <p>
                The Ethereum blockchain makes it possible to make financial
                transactions according to predefined rules. These contracts are
                carried out exactly as they are programmed, and you do not need to
                trust any human or central entity for this to happen. See the <a
                  href="https://www.ethereum.org/">Ethereum website</a> for more
                information.
              </p>
              <p>
                CaiShen is one such smart contract. When you give a smart red packet to
                someone using CaiShen, the recipient can only redeem the funds after the
                opening date you set. This is because CaiShen is programmed to <em>
                only</em> release the recipient's funds after the opening date.
              </p>
            </div>
          }

          {this.props.isZh ?
            <h3>你们会不会拿走我的红包？</h3>
            :
            <h3>Will you steal my money?</h3>
          }

          {this.props.isZh ?
            <div>
              <p>
                不会。
              </p>
              <p>
只有拥有了密码的指定接受人才可以领取红包。红包的金额牢牢锁在智能合约之内，只有拥有正确接受密码的人才可以开锁领取。
              </p>
            </div>
            :
            <div>
              <p>
                No. Only the person who owns a recipient's private keys can redeem a
                red packet. The entire creation of your Ethereum address, your
                recipient’s Ethereum address, and your interactions with the contract
                takes place in your browser.
              </p>
              <p>
                The funds are locked by the contract code and will only be released
                to the owner of the recipient’s private key. Not even we can access
                the funds. 
              </p>
            </div>
          }

          {this.props.isZh ?
            <h3>如果你们的网页不存在了怎么办？</h3>
            :
            <h3>What if your website does not exist anymore?</h3>
          }

          {this.props.isZh ?
            <p>
<strong>财神</strong>是一个基于以太坊区块链的分布式应用（dApp）。只要以太坊存在，您的红包就不会丢失。网页存在与否并不影响这一点。
            </p>
              :
            <p>
              CaiShen is a dApp (“distributed application”) and exists whereever
              there is an Ethereum node. As long as the Ethereum network exists,
              your red packet will always be around with its funds, <em>with or
              without us</em>.
            </p>
          }

          {this.props.isZh ?
            <h3>你们的代码安全吗？</h3>
              :
            <h3>Is your code safe?</h3>
          }

          {this.props.isZh ?
            <p>
              我们的智能合约代码已经被许多开发人员审查过了。
            </p>
            :
            <p>
              Our contract code has been reviewed by as many developers as
              possible.
            </p>
          }


          {this.props.isZh ?
            <h3>我忘记了密码怎么办？</h3>
            :
            <h3>I forgot my wallet password. </h3>
          }

          {this.props.isZh ?
            <p>
              对不起，我们无法帮您取回或重置密码。
            </p>
            :
            <p>
              Unfortunately, we cannot help with retrieving your old password or to
              reset your password.
            </p>
          }


          {this.props.isZh ?
            <h3>我的接受人忘记了密码怎么办？</h3>
            :
            <h3>My recipient forgot their wallet password or private key.</h3>
          }

          {this.props.isZh ?
            <p>
              对不起，我们无法帮他／她取回或重置密码。
            </p>
            :
            <p>
              Unfortunately, we cannot help with retrieving your old password or to
              reset your password.
            </p>
          }

          {this.props.isZh ?
            <h3>我的红包发送去了错误的地址怎么办？</h3>
            :
            <h3>I sent my funds to the wrong address.</h3>
          }

          {this.props.isZh ?
            <p>
对不起，一旦红包送出将无法取回。您可以试着找到地址所有人，然而我们无法帮您去做这件事。
            </p>
            :
            <p>
              Unfortunately, once the funds are sent, they cannot be retrieved.
              You may try to find out who owns that address. We are sorry that
              we cannot help with this process.
            </p>
          }

          {this.props.isZh ?
            <h3>我的指定日期设定错误怎么办？</h3>
            :
            <h3>I set the wrong withdrawal date.</h3>
          }

          {this.props.isZh ?
            <p>对不起，一旦日期设定，我们无法更改。</p>
              :
            <p>
              Unfortunately, we cannot alter the contract date once it has been set.
            </p>
          }

          {this.props.isZh ?
            <h3>
              为什么我不能用信托基金保管财物呢？
            </h3>
            :
            <h3>
              Why can't I just use a trust fund?
            </h3>
          }

          {this.props.isZh ?
            <p>
这将是您自己的决定。然而财神的价值在于它的去中心化，也就是说，您送出和接受的红包不受任何权威限制。红包的智能合约本身就决定了您无需依赖任何机构或个人。
            </p>
            :
            <p>
              That's completely up to you. The value that CaiShen brings to the
              table, however, is decentralisation and disintermediation. That means
              that you don't have to go through a human third party to give or
              receive a smart red packet, and you don't have to trust anyone for
              the smart contract to execute as programmed.
            </p>
          }

          {this.props.isZh ?
            <h3>我何时可以领取红包金额？</h3>
            :
            <h3>
              At what time on the opening date may I redeem the funds?
            </h3>
          }

          {this.props.isZh ?
            <p>
若赠送者使用本页面送出红包，领取时间将会设定为赠送者所在时区的子夜0点。比如说，若赠送者时区设定为东八区，那么领取行为将在指定日期的东八区0点之后才能进行。
            </p>
            :
            <p>
              If the giver used this web interface to send the funds, the opening
              time will be midnight in their timezone. For instance, if a giver
              used this website to send the funds on a computer that is configured
              to use the GMT+8 timezone, the red packet may be redeemed on or after
              the date they specified at midnight, GMT+8.
            </p>
          }


          {/*
          <p>
            To redeem your red packet manually,
            follow <a href="redeem/manual">these instructions</a>.
            要领取您的红包，请按以下步骤操作。
          </p>
          */}

          {this.props.isZh ?
            <h2>源代码</h2>
            :
            <h2>Source code</h2>
          }
          {this.props.isZh ?
            <p>
              请在<a 
                href="https://github.com/weijiekoh/caishen"
                target="_blank">这里</a>浏览源代码。
            </p>
            :
            <p>
              The source code of the smart contract can be 
              viewed <a href="https://github.com/weijiekoh/caishen">here</a>.
            </p>
          }
        </ContentBox>
      </div>
    )
  }
}
