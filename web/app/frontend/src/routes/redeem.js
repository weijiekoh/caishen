import { h, Component } from 'preact'
//const checkAddressChecksum = function (address) {
    //// Check each case
    //address = address.replace(/^0x/i,'');
    //var addressHash = sha3(address.toLowerCase()).replace(/^0x/i,'');

    //for (var i = 0; i < 40; i++ ) {
        //// the nth letter should be uppercase if the nth digit of casemap is 1
      //if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) ||
          //(parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
            //return false;
        //}
    //}
    //return true;
//};


//const isAddress = address => {
    //// check if it has the basic requirements of an address
    //if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        //return false;
        //// If it's ALL lowercase or ALL upppercase
    //} else if (/^(0x|0X)?[0-9a-f]{40}$/.test(address) || /^(0x|0X)?[0-9A-F]{40}$/.test(address)) {
        //return true;
        //// Otherwise check each case
    //} else {
        //return checkAddressChecksum(address);
    //}
//};


export default class Redeem extends Component{
  constructor(props){
    super(props);
    this.state = {
      address: "",
      valid: false,
    };
  }


  handleRedeemBtnClick = () => {
  }


  handleAddressChange = e => {
    const address = e.target.value;
    this.setState({ address: address }, () => {
      this.validateInputs();
    });
  }


  validateInputs = () => {
    let valid = false;

    if (this.state.address.length > 0){
      valid = true;
    }
    //valid = isAddress(this.state.address);

    this.setState({ valid });
  }


  render() {
    return (
      <div class="redeem pure-form pure-form-stacked">
        <fieldset>
          <label for="address">Enter your ETH address.</label>
          <input 
            onKeyUp={this.handleAddressChange}
            value={this.state.address}
            name="address" type="text" />
          {this.state.valid ?
            <button 
              onClick={this.handleRedeemBtnClick}
              class="pure-button button-success">
              Redeem funds
            </button>
            :
            <button 
              disabled
              onClick={this.handleRedeemBtnClick}
              class="pure-button button-success">
              Redeem funds
            </button>
          }
        </fieldset>
      </div>
    )
  }
}
