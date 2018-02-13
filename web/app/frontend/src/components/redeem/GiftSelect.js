import { h, Component } from 'preact'
import { formatDate } from "../../dates.js";
import TxSuccess from "./TxSuccess.js";
import PendingTransaction from "../PendingTransaction.js";


class Gift extends Component {
  state = {
    transaction: null,
    hideRedeem: false,
    btnClicked: false,
  };


  handleRedeemBtnClick = () => {
    this.setState({ 
      btnClicked: true,
    }, () => {
      this.props.caishen.redeem(this.props.gift.id).then(tx => {
        this.setState({
          transaction: { txHash: tx.receipt.transactionHash },
          hideRedeem: true,
          btnClicked: false,
        });
      }).catch(err => {
        this.setState({ btnClicked: false });
      });
    });
  }


  render(){
    const expiry = this.props.gift.expiry;
    const expiryTimestamp = expiry.getTime();

    const now = parseInt((Date.now() / 1000).toFixed(0), 10);
    const hasExpired = now > expiryTimestamp;

    let giver = 
      this.props.isZh ?
        <p>赠送人地址: <pre>{this.props.gift.giver}</pre></p>
        :
        <p>From: <pre>{this.props.gift.giver}</pre></p>

    if (this.props.gift.giverName.length > 0){
      giver = (
        <div>
          {this.props.isZh ?
            <p>赠送人姓名: {this.props.gift.giverName}</p>
            :
            <p>Giver's name: {this.props.gift.giverName}</p>
          }

          {this.props.gift.message.length > 0 && this.props.isZh &&
            <p>赠送人留言: {this.props.gift.message}</p>
          }

          {this.props.gift.message.length > 0 && !this.props.isZh &&
            <p>Giver's message: {this.props.gift.message}</p>
          }

          {this.props.isZh ?
            <p>以太币地址: <pre>{this.props.gift.giver}</pre></p>
            :
            <p>ETH Address: <pre>{this.props.gift.giver}</pre></p>
          }
        </div>
      );
    }

    const timestamp = formatDate(new Date(this.props.gift.timestamp.toNumber()), this.props.isZh);

    return (
      <div class="gift">
        {this.props.isZh ?
          <p>赠送日期: {timestamp}</p>
          :
          <p>Date of receipt: {timestamp}</p>
        }

        {this.props.isZh ?
          <p>金额: {this.props.gift.amount} ETH</p>
          :
          <p>Amount: {this.props.gift.amount} ETH</p>
        }

        {giver}

        {this.props.gift.giverName.length === 0 &&
         this.props.gift.message.length > 0 &&
         this.props.isZh &&
          <p>赠送人留言: {this.props.gift.message}</p>
        }

        {this.props.gift.giverName.length === 0 &&
         this.props.gift.message.length > 0 &&
         !this.props.isZh &&
          <p>Giver's message: {this.props.gift.message}</p>
        }

        {this.props.isZh ?
          <p>领取日期: {formatDate(expiry, true)}</p>
          :
          <p>Date of redemption: {formatDate(expiry, false)}</p>
        }

        {this.state.transaction != null &&
          <TxSuccess 
            label={this.props.isZh ?
                "红包已领取。"
                :
                "Gift redeemed."}
            transaction={this.state.transaction} />
        }

        <div class="pure-u-md-3-4">
          {!this.state.btnClicked && hasExpired && !this.state.hideRedeem &&
            <button
              class="pure-button button-success"
              onClick={this.handleRedeemBtnClick}>
              {this.props.isZh ? "领取" : "Redeem"}
            </button>

          }
          {this.state.btnClicked && <PendingTransaction isZh={this.props.isZh}/> }
        </div>
      </div>
    );
  }
}

export default class GiftSelect extends Component {
  state = {
    gifts: [],
    showResult: false,
  };


  componentWillMount = () => {
    this.retriveGiftInfo(this.props.caishen);
  }


  retriveGiftInfo = caishen => {
    let gifts = [];
    if (caishen){
      caishen.getGiftIdsByRecipient.call(this.props.address).then(giftIds => {
        if (giftIds.length === 0){
          this.setState({ 
            gifts: [],
            showResult: true
          });
        }
        else{
          giftIds.forEach(giftId => {
            caishen.giftIdToGift(giftId).then(gift => {
              // Only show gifts which exist and have not yet been redeemed
              if (gift[0] && !gift[6]){
                gifts.push({
                  id: gift[1].toNumber(),
                  giver: gift[2],
                  expiry: new Date(gift[4].toNumber()),
                  amount: web3.fromWei(gift[5]).toFixed(8),
                  giverName: gift[7],
                  message: gift[8],
                  timestamp: gift[9]
                });
              }
            }).then(() => {
              const showResult = true;
              this.setState({ gifts, showResult });
            }).catch(err => {
              this.setState({ gifts: [], showResult: true });
              console.error(err);
            });
          });
        }
      });
    }
  }


  componentWillReceiveProps = newProps => {
    if (this.props.address !== newProps.address){
      this.setState({ gifts: [] }, this.retriveGiftInfo);
    }

    if (this.props.caishen !== newProps.caishen){
      this.retriveGiftInfo(newProps.caishen);
    }
  }


  render() {
    if (this.state.noWeb3 && this.props.renderNoWeb3){
      return this.props.renderNoWeb3();
    }

    if (this.state.showResult === false){
      return (
        <div>
          {this.props.isZh ?
            <p>加载中......</p>
            :
            <p>Loading...</p>
          }
        </div>
      );
    }

    let sortedGifts = this.state.gifts;
    if (this.state.showResult && this.state.gifts.length === 0){
      return (
        <div>
          {this.props.isZh ?
            <p>您没有收到任何红包。</p>
            :
            <p>You didn't receive any gifts.</p>
          }
        </div>
      );
    }

    sortedGifts.sort((a, b) => {
      const aExpiry = a.expiry.getTime();
      const bExpiry = b.expiry.getTime();
      const aGiver = a.giver;
      const bGiver = b.giver;

      return aExpiry - bExpiry || a.amount - b.amount || aGiver || bGiver;
    });

    return (
      <div class="gift_select">
        {sortedGifts.map(gift => 
          <Gift 
            isZh={this.props.isZh}
            caishen={this.props.caishen}
            address={this.props.address}
            gift={gift} />
        )}
      </div>
    );
  }
}
