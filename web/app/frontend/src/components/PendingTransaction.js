import { h, Component } from "preact";

export default class PendingTransaction extends Component {
  render() {
    return(
      <div class="pending_transaction">
        <div class="text">
          <p>Sending transaction, please wait...</p>
        </div>
        <div class="spinner"></div>
      </div>
    );
  }
}
