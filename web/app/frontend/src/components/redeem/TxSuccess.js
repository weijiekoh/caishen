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
          <em class="success">Transaction broadcasted.</em>
          <p>
            <a target="_blank"
              href={url + this.props.transaction.txHash}>
              Click here
            </a> to 
            view the status of the transaction.
          </p>
        </div>
      </div>
    );
  }
}
