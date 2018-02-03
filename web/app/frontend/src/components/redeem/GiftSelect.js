import { h, Component } from 'preact'
import { formatDate } from "../../dates.js";
import ReturnFunds from "./ReturnFunds.js";
import ChangeRecipient from "./ChangeRecipient.js";


class Gift extends Component {
  state = {
    showAdvanced: false,
    hideReturn: false,
    hideChangeRecipient: false
  };


  render(){
    const expiry =  this.props.gift.expiry;
    return (
      <div class="gift">
        <p>{this.props.gift.amount} ETH given by</p>
        <pre>{this.props.gift.giver}</pre>
        <p>
          {Date.now() > expiry.getTime() &&
              "May be redeemed after " + formatDate(expiry)
              }
        </p>
        <div class="pure-u-md-3-4">
          {Date.now() < expiry.getTime() &&
            <button
              class="pure-button button-success"
              onClick={this.handleRedeemBtnClick}>
              Redeem
            </button>
          }
        </div>
        <div class="pure-u-md-1-4">
          <span class="advanced_opt_link">
            {!this.state.showAdvanced &&
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
            <h3>Advanced options</h3>

            {!this.state.hideChangeRecipient &&
              <div>
                <h4>Change recipient</h4>
                <ChangeRecipient
                  caishen={this.props.caishen}
                  gift={this.props.gift}
                  hideReturn={() => this.setState({hideReturn: true})}
                  address={this.props.address} />
              </div>
            }

            {!this.state.hideReturn &&
              <div>
                <h4>Return to giver</h4>
                <ReturnFunds
                  caishen={this.props.caishen}
                  gift={this.props.gift}
                  hideChangeRecipient={() => {this.setState({hideChangeRecipient: true})}}
                  address={this.props.address} />
              </div>
            }

          </div>
        }
        <hr />
      </div>
    );
  }
}

export default class GiftSelect extends Component {
  state = {
    gifts: [],
  };


  componentWillMount = () => {
    let gifts = [];
    this.props.caishen.getGiftIdsByRecipient.call(this.props.address).then(giftIds => {
      giftIds.forEach(giftId => {
        this.props.caishen.giftIdToGift(giftId).then(gift => {
          // Only show gifts which exist, have not been redeemed, and have not
          // been returned
          if (gift[0] && !gift[7] && !gift[8]){
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


  render() {
    let sortedGifts = this.state.gifts;
    if (this.state.gifts.length === 0){
      return <p>You didn't receive any gifts.</p>
    }
    sortedGifts.sort((a, b) => a.expiry - b.expiry);

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
