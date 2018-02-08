import { h, Component } from "preact"


export default class Web3Enabled extends Component{
  renderAccountInfo = () => {
    return(
      <div class="account_info">
        <p>Your address: <pre>{this.props.address}</pre></p>
        <p>Your balance: <pre>{web3.fromWei(this.props.balance, "ether").toString()}</pre> ETH</p>
      </div>
    );
  }


  renderPlsConnect = () => {
      return <p>Use MetaMask to connect to the main Ethereum network.</p>
  }


  render() {
    if (this.props.web3Status === this.props.web3StatusCodes.missing){
      return this.props.renderNoWeb3();
    }
    else if (this.props.web3Status === this.props.web3StatusCodes.locked){
      return this.props.renderLockedWeb3();
    }
    else if (this.props.web3Status === this.props.web3StatusCodes.unlocked){
      return this.renderUnlockedWeb3();
    }
    else{
      return (
        <p>
          Please ensure that MetaMask is connected to the Ethereum network.
        </p>
      );
    }
  }
}
