import { h, Component } from 'preact'

import { formatDate } from "../dates.js";
import Web3Enabled from "../components/Web3Enabled.js";
import ContentBox from "../components/ContentBox.js";
import EthAmountInput from "../components/input/EthAmountInput.js";
import ExpiryDateInput from "../components/input/ExpiryDateInput.js";
import EthAccountInput from "../components/input/EthAccountInput.js";
import ShortTextInput from "../components/input/ShortTextInput.js";
import LongTextInput from "../components/input/LongTextInput.js";
import PendingTransaction from "../components/PendingTransaction.js";
var Web3 = require("web3");


export default class Give extends Web3Enabled{
  constructor(props){
    super(props);

    this.filter = null;

    Object.assign(this.state, {
      address: null,
      balance: null,

      amount: "",
      expiry: "",
      recipient: "",
      giverName: "",
      message: "",

      validAmount: false,
      validExpiry: false,
      validRecipient: false,
      validGiverName: true,
      validMessage: true,

      showErrorMsgs: false,
      showForm: true,

      transactions: [],

      changeCounter: 0,
    });
  }


  handleRecipientChange = (value, valid) => {
    this.setState({ 
      recipient: value,
      validRecipient: valid,
    });
  }


  handleAmountChange = (value, valid) => {
    this.setState({
      amount: value,
      validAmount: valid,
    });
  }


  handleExpiryChange = (value, valid) => {
    this.setState({ 
      expiry: value,
      validExpiry: valid,
    });
  }


  handleGiverNameChange = (value, valid)  => {
    this.setState({ 
      giverName: value,
      validGiverName: valid,
    });
  }


  handleMessageChange = (value, valid) => {
    this.setState({ 
      message: value,
      validMessage: valid,
    });
  }


  handleGiveBtnClick = () => {
    const valid = this.state.validAmount &&
      this.state.validRecipient &&
      this.state.validExpiry &&
      this.state.validGiverName &&
      this.state.validMessage;

    if (valid){
      const recipientAddress = this.state.recipient;
      const amountWei = web3.toWei(this.state.amount, "ether");
      const expiry = this.state.expiry.getTime() / 1000;
      const giverName = this.state.giverName.trim();
      const message = this.state.message.trim()

      const payload = {
        value: amountWei,
        from: this.state.address
      };

      this.setState({ btnClicked: true, showForm: false, showErrorMsgs: false }, () => {
        // Estimate gas
        this.props.caishen.give.estimateGas(
          recipientAddress, expiry, giverName, message, {value: amountWei})
        .then(gas => {
          payload.gas = gas;

          this.props.caishen.give(
            recipientAddress, expiry, giverName, message, payload).then(tx => {

            let transactions = this.state.transactions;
            if (typeof transactions === "undefined"){
              transactions = [];
            }

            transactions.push({
              txHash: tx.receipt.transactionHash,
              txAmount: amountWei,
              txExpiry: new Date(expiry),
              txRecipient: recipientAddress,
            });

            this.setState({ 
              transactions: transactions,
              changeCounter: Math.random(),
              showErrorMsgs: false,
              btnClicked: false,
              amount: "",
              expiry: "",
              recipient: "",
              validAmount: false,
              validExpiry: false,
              validRecipient: false,
            });
          }).catch(err => {
            this.setState({ 
              transactions: [],
              btnClicked: false,
              showForm: true,
              showErrorMsgs: false,
              changeCounter: Math.random(),
              amount: "",
              expiry: "",
              recipient: "",
            });
          });
        });
      });
    }
    else {
      this.setState({ 
        showErrorMsgs: true,
      });
    }
  }

  renderTransactions = transactions => {
    const networkId = web3.version.network;
    let url = "https://etherscan.io/tx/"
    if (networkId === "3"){
      url = "https://ropsten.etherscan.io/tx/";
    }

    return transactions.map((transaction, i) => 
      <div class="transaction_success">
        {this.props.isZh ?
          <em class="success">红包已送出。</em>
          :
          <em class="success">Red packet sent.</em>
        }

        {this.props.isZh ?
          <p>以太币地址</p>
          :
          <p>The owner of the ETH address </p>
        }

        <p><pre>{transaction.txRecipient}</pre></p>

        {this.props.isZh ?
          <p>
            的所有人可以于{formatDate(transaction.txExpiry, true)}
            零点后领取{web3.fromWei(transaction.txAmount)} 以太币。
          </p>
            :
          <p>
            may redeem {web3.fromWei(transaction.txAmount)} ETH after 
            midnight, {formatDate(transaction.txExpiry, false)}.
          </p>
        }

        {this.props.isZh ?
          <p>
            <a target="_blank" href={url + transaction.txHash}>
              点击此处
            </a>
            查看交易详情。
          </p>
          :
          <p>
            <a target="_blank" href={url + transaction.txHash}>
              Click here
            </a> to 
            view the transaction details.
          </p>
        }
        <hr />
      </div>
    );
  }


  renderUnlockedWeb3() {
    const offset = new Date().getTimezoneOffset();
    const minutes = Math.abs(offset);
    const hours = Math.floor(minutes / 60);
    const prefix = offset < 0 ? "+" : "-";
    const timezone = prefix + hours;

    const dateLabel = this.props.isZh ?
      "请选择接收人最早领取日期。红包将于东" + timezone + "区此日期零点时分解锁，以便接收人领取。"
      :
      "Select the earliest date for the recipient to claim the funds. The opening time will be set as midnight, GMT" + timezone + ".";

    return (
      <div class="give">
        <ContentBox isZh={this.props.isZh}>
          <div class="pure-form pure-form-stacked">
            {this.props.isZh ?
              <h1>赠送智能红包</h1>
              :
              <h1>Give a smart red packet</h1>
            }
            {this.renderAccountInfo()}

            <hr />

            {this.state.transactions && this.state.transactions.length > 0 &&
              this.renderTransactions(this.state.transactions)}

            {this.state.showForm &&
              <fieldset>
                <EthAmountInput 
                  isZh={this.props.isZh}
                  name="amount"
                  changeCounter={this.state.changeCounter}
                  label={
                    this.props.isZh ?
                    "请输入您要赠出的以太币数额"
                    :
                    "Enter the amount of ETH to give."
                  }
                  handleChange={this.handleAmountChange}
                  showErrorMsgs={this.state.showErrorMsgs}
                  handleEnterKeyDown={this.handleGiveBtnClick}
                  maximum={this.props.balance}
                  showFee={true}
                  smallerInput={true}
                />

                <EthAccountInput
                  isZh={this.props.isZh}
                  name="recipient"
                  changeCounter={this.state.changeCounter}
                  label={
                    this.props.isZh ?
                      "请输入接收人以太币地址"
                      :
                      "Enter the recipient's ETH address."
                  }
                  handleChange={this.handleRecipientChange}
                  handleEnterKeyDown={this.handleGiveBtnClick}
                  showErrorMsgs={this.state.showErrorMsgs}
                  notThisAddress={this.props.address}
                  smallerInput={false}
                />

                <ExpiryDateInput
                  isZh={this.props.isZh}
                  name="expiry"
                  changeCounter={this.state.changeCounter}
                  label={dateLabel}
                  handleChange={this.handleExpiryChange}
                  showErrorMsgs={this.state.showErrorMsgs}
                />

                <ShortTextInput
                  isZh={this.props.isZh}
                  name="giver_name"
                  changeCounter={this.state.changeCounter}
                  label={
                    this.props.isZh ?
                    "非必填项：请输入您的姓名"
                    :
                    "Optional: Enter your name."
                  }
                  handleChange={this.handleGiverNameChange}
                  handleEnterKeyDown={this.handleGiverNameChange}
                  showErrorMsgs={this.state.showErrorMsgs}
                  maxLength={60}
                />

                <LongTextInput
                  isZh={this.props.isZh}
                  name="giver_msg"
                  changeCounter={this.state.changeCounter}
                  label={
                    this.props.isZh ?
                      "非必填项：请输入您给接收人的留言"
                      :
                      "Optional: Enter a short message for the recipient."
                  }
                  handleChange={this.handleMessageChange}
                  handleEnterKeyDown={this.handleMessageChange}
                  showErrorMsgs={this.state.showErrorMsgs}
                  maxLength={140}
                />

                <p>
                  {this.props.isZh ?
                    <em>
                      请注意您以上输入的信息将存储于区块链中，为所有人可见。
                    </em>
                    :
                    <em>
                      Please note that the information you enter above will be stored
                      on the blockchain and can be seen by anyone.
                    </em>
                  }
                </p>

              </fieldset>
            }

            {this.state.btnClicked && <PendingTransaction isZh={this.props.isZh}/> }

            {this.state.showErrorMsgs && this.props.isZh &&
              <p class="error">请输入有效的信息。</p>
            }

            {this.state.showErrorMsgs && !this.props.isZh &&
              <p class="error">Please provide valid information above.</p>
            }

            {this.state.showForm &&
              <button 
                onClick={this.handleGiveBtnClick}
                class="pure-button button-success">
                {this.props.isZh ? "赠送" : "Give"}
              </button>
            }

          </div>
        </ContentBox>
      </div>
    );
  }
}
