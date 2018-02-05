import { h, Component } from 'preact'
import { formatDate } from "../../dates.js";
import ReturnFunds from "./ReturnFunds.js";
import ChangeRecipient from "./ChangeRecipient.js";
import TxSuccess from "./TxSuccess.js";
import PendingTransaction from "../PendingTransaction.js";


class Gift extends Component {
  state = {
    transaction: null,
    hideReturn: false,
    hideRedeem: false,
    hideChangeRecipient: false,
    showAdvanced: false,
    btnClicked: false,
  };


  handleRedeemBtnClick = () => {
    this.setState({ 
      btnClicked: true,
      showAdvanced: false 
    }, () => {
      this.props.caishen.redeem.estimateGas(this.props.gift.id).then(gas => {
        this.props.caishen.redeem(this.props.gift.id, { gas }).then(tx => {
          this.setState({
            transaction: { txHash: tx.receipt.transactionHash },
            hideReturn: true,
            hideRedeem: true,
            hideChangeRecipient: true,
            btnClicked: false,
          });
        }).catch(err => {
          this.setState({ btnClicked: false });
        });
      });
    });
  }


  render(){
    const returnClass = this.state.hideReturn ? "hidden" : "";
    const changeRecipientClass = this.state.hideChangeRecipient ? "hidden" : "";
    const expiry = this.props.gift.expiry;
    const expiryTimestamp = expiry.getTime();

    const now = parseInt((Date.now() / 1000).toFixed(0), 10);
    const hasExpired = now > expiryTimestamp;

    return (
      <div class="gift">
        <p>{this.props.gift.amount} ETH given by</p>
        <pre>{this.props.gift.giver}</pre>
        <p>
          {!hasExpired &&
            "May be redeemed after " + formatDate(expiry)
          }
        </p>

        {this.state.transaction != null &&
          <TxSuccess transaction={this.state.transaction} />
        }

        <div class="pure-u-md-3-4">
          {!this.state.btnClicked && hasExpired && !this.state.hideRedeem &&
            <button
              class="pure-button button-success"
              onClick={this.handleRedeemBtnClick}>
              Redeem
            </button>

          }
          {this.state.btnClicked && <PendingTransaction /> }
        </div>

        <div class="pure-u-md-1-4">
          <span class="advanced_opt_link">
            {!this.state.btnClicked &&
             !this.state.hideRedeem &&
             !this.state.showAdvanced &&
              <a onClick={() => {
                this.setState({ showAdvanced: true });
              }}>
                Advanced options
              </a>
            }
          </span>
        </div>

        {this.state.showAdvanced &&
          <div class="advanced">
            <div>
              <h3>Advanced options</h3>

              <p>
                Note: if any of these options don't work, try again with a higher
                gas limit.
              </p>
            </div>

            <div class={changeRecipientClass}>
              <h4>Change recipient</h4>
              <ChangeRecipient
                gift={this.props.gift}
                caishen={this.props.caishen}
                address={this.props.address}
                onBtnClick={() => {
                  this.setState({
                    hideChangeRecipient: false,
                    hideReturn: true,
                    hideRedeem: true,
                  })
                }} 
                onCancel={() => {
                  this.setState({
                    hideChangeRecipient: false,
                    hideReturn: false,
                    hideRedeem: false,
                  })
                }}
              />
            </div>

            <div class={returnClass}>
              <h4 class="return_label">Return to giver</h4>

              <ReturnFunds
                gift={this.props.gift}
                caishen={this.props.caishen}
                address={this.props.address}
                onBtnClick={() => {
                  this.setState({
                    hideChangeRecipient: true,
                    hideReturn: false,
                    hideRedeem: true,
                  })
                }} 
                onCancel={() => {
                  this.setState({
                    hideChangeRecipient: false,
                    hideReturn: false,
                    hideRedeem: false,
                  })
                }} 
              />
            </div>

          </div>
        }

      </div>
    );
  }
}

export default class GiftSelect extends Component {
  state = {
    gifts: [],
  };


  componentWillMount = () => {
    this.retriveGiftInfo();
  }

  retriveGiftInfo = () => {
    let gifts = [];
    this.props.caishen.getGiftIdsByRecipient.call(this.props.address).then(giftIds => {
      giftIds.forEach(giftId => {
        this.props.caishen.giftIdToGift(giftId).then(gift => {
          // Only show gifts which exist, and have been neither redeemed,
          // returned, nor refunded.
          if (gift[0] && !gift[6] && !gift[7] && !gift[8]){
            gifts.push({
              id: gift[1].toNumber(),
              giver: gift[2],
              expiry: new Date(gift[4].toNumber()),
              amount: web3.fromWei(gift[5]).toFixed(8),
            });
            this.setState({gifts});
          }
        });
      });
    });
  }


  componentWillReceiveProps = newProps => {
    if (this.props.address !== newProps.address){
      this.setState({ gifts: [] }, this.retriveGiftInfo);
    }
  }


  render() {
    if (this.state.noWeb3 && this.props.renderNoWeb3){
      return this.props.renderNoWeb3();
    }

    let sortedGifts = this.state.gifts;
    if (this.state.gifts.length === 0){
      return (
        <div>
          <p>You didn't receive any gifts.</p>
        </div>
      );
    }

    sortedGifts.sort((a, b) => {
      const aExpiry = a.expiry.getTime();
      const bExpiry = b.expiry.getTime();
      if (a.giver === b.giver){
        if (aExpiry === bExpiry){
          return a.amount - b.amount;
        }
        else{
          return aExpiry - bExpiry;
        }
      }
      else{
        return a.giver.localeCompare(b.giver);
      }
    });

    return (
      <div class="gift_select">
        {sortedGifts.map(gift => 
          <Gift 
            caishen={this.props.caishen}
            address={this.props.address}
            gift={gift} />
        )}
      </div>
    );
  }
}
