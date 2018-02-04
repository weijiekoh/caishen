import { h, Component } from "preact";

export default class PendingTransaction extends Component {
  render() {
    return(
      <div>
        <div class="pending_transaction">
          <div class="text">
            <p>Sending transaction, please wait...</p>
          </div>
          <div class="spinner"></div>
        </div>
        <p><em>Click on the MetaMask icon if you don't see a pop-up.</em></p>
      </div>
    );
  }
}
