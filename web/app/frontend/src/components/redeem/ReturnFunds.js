import { h, Component } from "preact";
import TxSuccess from "./TxSuccess.js";
import PendingTransaction from "../PendingTransaction.js";

export default class ReturnFunds extends Component {
  constructor(props){
    super(props);
    this.state = {
      transaction: null,
    };
  }


  handleReturnFundsClick = () => {
    const giftId = this.props.gift.id;

    this.setState({ btnClicked: true }, () => {
      this.props.onBtnClick();
      this.props.caishen.returnToGiver(giftId).then(tx => {

        const transaction = { txHash: tx.receipt.transactionHash };
        this.setState({ transaction });

      }).catch(err => {
        this.setState({ btnClicked: false }, this.props.onCancel);
      });

    });
  }


  render() {
    return (
      <div class="return_funds">

        {this.state.transaction != null ?
            <TxSuccess
              label="Gift returned."
              transaction={this.state.transaction} />
          :
          <fieldset>

            {this.state.btnClicked && <PendingTransaction /> }

            <button 
              onClick={this.handleReturnFundsClick}
              class="pure-button button-primary">
              Return funds
            </button>
          </fieldset>
        }
      </div>
    );
  }
}
