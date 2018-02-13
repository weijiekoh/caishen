import { h, Component } from "preact"
import ContentBox from "./ContentBox.js";


export default class Web3Enabled extends Component{
  componentDidMount = () => {
    window.scrollTo(0, 0);
  }


  renderAccountInfo = () => {
    return(
      <div class="account_info">
        {this.props.isZh ?
          <p>您的以太币地址： <pre>{this.props.address}</pre></p>
          :
          <p>Your address: <pre>{this.props.address}</pre></p>
        }

        {this.props.isZh ?
          <p>您的以太币余额： <pre>{web3.fromWei(this.props.balance, "ether").toString()}</pre> ETH</p>
          :
          <p>Your balance: <pre>{web3.fromWei(this.props.balance, "ether").toString()}</pre> ETH</p>
        }
      </div>
    );
  }


  renderPlsConnect = (title, isZh) => {
    const text = isZh ?
      <p>请使用MetaMask连接以太坊主网。</p>
      :
      <p>Use MetaMask to connect to the main Ethereum network.</p>

    return (
      <ContentBox isZh={isZh}>
        {title}
        {text}
        <img src="/static/images/metamask_mainnet.png" />
      </ContentBox>
    );
  }


  render() {
    const title = (this.props.isZh ?
      <h1>{this.props.zhTitle}</h1>
      :
      <h1>{this.props.enTitle}</h1>);

    if (this.props.renderReady){
      if (this.props.web3Status === this.props.web3StatusCodes.missing){
        return this.props.renderNoWeb3(title, this.props.isZh);
      }
      else if (this.props.web3Status === this.props.web3StatusCodes.locked){
        return this.props.renderLockedWeb3(title, this.props.isZh);
      }
      else if (this.props.web3Status === this.props.web3StatusCodes.unlocked){
        return this.renderUnlockedWeb3();
      }
      else if (this.props.web3Status === this.props.web3StatusCodes.wrongNet){
        return this.renderPlsConnect(title, this.props.isZh);
      }
    }
  }
}
