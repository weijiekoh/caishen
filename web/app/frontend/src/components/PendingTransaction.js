import { h, Component } from "preact";

export default class PendingTransaction extends Component {
  render() {
    return(
      <div>
        <div class="pending_transaction">
          <div class="text">
          {this.props.isZh ?
            <p>交易进行中，请稍候......</p>
            :
            <p>Sending transaction, please wait...</p>
          }
          </div>
          <div class="spinner"></div>
        </div>
        <p>
          {this.props.isZh ?
            <em>
              若无弹出窗口，请点击浏览器工具栏上的MetaMask按钮
            </em>
            :
            <em>
              Click on the MetaMask icon in your browser's toolbar if you don't
              see a pop-up.
            </em>
          }
        </p>
      </div>
    );
  }
}
