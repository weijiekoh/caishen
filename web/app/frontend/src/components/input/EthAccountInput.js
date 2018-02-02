import { h, Component } from 'preact'
import Input from "./Input.js";

export default class EthAccountInput extends Input{
  validate = address => {
    return web3.isAddress(address) &&
           this.props.ownAddress !== address;
  }


  genErrorMsg = address => {
    if (address == null || address.trim().length == 0){
      return "Enter an address.";
    }
    else if (!web3.isAddress(address)){
      return "Please enter a valid ETH address.";
    }
    else if (this.props.ownAddress &&
             this.props.ownAddress.toLowerCase() === address.toLowerCase()){
      return "The recipient address must not be your current address.";
    }
  }
}
