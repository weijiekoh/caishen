import { h, Component } from 'preact'

import EthAccountInput from "../../components/input/EthAccountInput.js";
import PendingTransaction from "../PendingTransaction.js";
import TxSuccess from "./TxSuccess.js";


export default class ChangeRecipient extends Component{
  constructor(props){
    super(props);
    this.state = {
      newRecipientAddress: "",
      valid: false,
      transaction: null,
    };
  }


  handleNewRecipientChange = (value, valid) => {
    this.setState({
      newRecipientAddress: value,
      valid: valid,
    });
  }


  handleNewRecipientClick = () => {
    if (this.state.valid){
      this.props.onBtnClick();

      this.setState({ btnClicked: true }, () => {
        const giftId = this.props.gift.id;
        const newAdd = this.state.newRecipientAddress;

        this.props.caishen.changeRecipient.estimateGas(newAdd, giftId).then(gas => {
          this.props.caishen.changeRecipient(newAdd, giftId, {gas}).then(tx => {
              return { txHash: tx.receipt.transactionHash };
          }).then(transaction => {

            this.setState({
              showErrorMsgs: false,
              transaction: transaction,
            });

          }).catch(err => {
            this.setState({ btnClicked: false }, this.props.onCancel);
          });

        });
      });
    }
    else{
      this.setState({
        showErrorMsgs: true,
      });
    }
  }


  render() {
    return (
      <div class="change_recipient">

        {this.state.transaction != null ?
          <TxSuccess 
            label="Recipient changed."
            transaction={this.state.transaction} />
          :
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

            {this.state.btnClicked && <PendingTransaction /> }

            <button 
              onClick={this.handleNewRecipientClick}
              class="change_recipient_btn pure-button button-primary">
              Change recipient
            </button>
          </fieldset>
        }
      </div>
    );
  }
}

