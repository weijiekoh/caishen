import { h, Component } from 'preact'
import Input from "./Input.js";

export default class EthAccountInput extends Input{
  validate = address => {
    let valid = typeof address !== "undefined" &&
           web3.isAddress(address) &&
           this.props.notThisAddress.toLowerCase() !== address.trim().toLowerCase();
    
    if (this.props.notGiverAddress &&
        this.props.notGiverAddress.trim().toLowerCase() === address.trim().toLowerCase()){
      valid = false;
    }

    return valid;
  }


  genErrorMsg = address => {
    if (address == null || address.trim().length == 0){
      return "Enter an address.";
    }
    else if (!web3.isAddress(address.trim())){
      return "Enter a valid ETH address.";
    }
    else if (this.props.notThisAddress.toLowerCase() === address.trim().toLowerCase()){
      return this.props.notThisAddressMsg;
    }
    else if (this.props.notGiverAddress &&
        this.props.notGiverAddress.trim().toLowerCase() === address.trim().toLowerCase()){
      return this.props.notGiverAddressMsg;
    }
  }
}
