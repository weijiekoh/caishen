import { h, Component } from 'preact'

export default class TxSuccess extends Component {
  render() {
    const networkId = web3.version.network;
    let url = "https://etherscan.io/tx/"
    if (networkId === "3"){
      url = "https://ropsten.etherscan.io/tx/";
    }
    return (
      <div class="transactions">
        <div class="transaction_success">
          <em class="success">{this.props.label}</em>
          {this.props.isZh ?
            <p>
              <a target="_blank" href={url + this.props.transaction.txHash}>
                点击此处
              </a>
              查看交易详情。
            </p>
            :
            <p>
              <a target="_blank" href={url + this.props.transaction.txHash}>
                Click here
              </a> to 
              view the transaction details.
            </p>
          }
        </div>
      </div>
    );
  }
}
