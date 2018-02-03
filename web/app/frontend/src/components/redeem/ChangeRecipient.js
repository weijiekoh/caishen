import { h, Component } from 'preact'

import EthAccountInput from "../../components/input/EthAccountInput.js";


export default class ChangeRecipient extends Component{
  state = {
    newRecipientAddress: "",
    valid: true,
    transactions: [],
  };

  handleNewRecipientChange = (value, valid) => {
    this.setState({
      newRecipientAddress: value,
      valid: valid,
    });
  }

  handleNewRecipientClick = () => {
    if (this.state.valid){
      console.log(this.props.gift);
      const giftId = this.props.gift.id;
      const newAdd = this.state.newRecipientAddress;
      console.log(newAdd, giftId);
      this.props.caishen.changeRecipient.estimateGas(newAdd, giftId)
      .then(gas => {
        this.props.caishen.changeRecipient(newAdd, giftId, {gas: gas * 2})
        .then(tx => {
          let transactions = this.state.transactions;
          transactions.push({
            txHash: tx.receipt.transactionHash,
          });
          this.setState({
            showErrorMsgs: false,
            transactions: transactions,
          }, this.props.hideReturn());
        });
      });
    }
    else{
      this.setState({
        showErrorMsgs: true,
      });
    }
  }


  renderTx = (transaction, i) => {
    return (
      <div class="transaction_success">
        <em class="success">Transaction broadcasted.</em>
        <p>
          <a target="_blank" href={"https://etherscan.io/tx/" + transaction.txHash}>
            Click here
          </a> to 
          view the status of the transaction.
        </p>
      </div>
    );
  }

  render() {
    return (
      <div class="change_recipient">

        {this.state.transactions.length > 0 &&
          <div class="transactions">
            {this.state.transactions.map(this.renderTx)}
          </div>
        }

        {this.state.transactions.length === 0 &&
          <fieldset>
            <EthAccountInput
              name="change_recipient"
              label={"Enter the new recipient's ETH address:"}
              handleChange={this.handleNewRecipientChange}
              showErrorMsgs={this.state.showErrorMsgs}
              handleEnterKeyDown={this.handleNewRecipientClick}
              notThisAddress={this.props.address}
              notThisAddressMsg={"The new address must be different."}
              notGiverAddress={this.props.gift.giver}
              notGiverAddressMsg={"The new address must not be the giver's address."}
              smallerInput={false}
            />

            <p>Note: if this transaction fails, try again with a higher gas limit.</p>

            <button 
              onClick={this.handleNewRecipientClick}
              class="pure-button button-primary">
              Change recipient
            </button>
          </fieldset>
        }
      </div>
    );
  }
}

