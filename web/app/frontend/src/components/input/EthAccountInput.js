import { h, Component } from 'preact'
import Input from "./Input.js";

export default class EthAccountInput extends Input{
  validate = address => {
    let valid = typeof address !== "undefined" &&
           web3.isAddress(address) &&
           this.props.notThisAddress.toLowerCase() !== address.trim().toLowerCase();

    return valid;
  }


  genErrorMsg = address => {
    if (address == null || address.trim().length == 0){
      return this.props.isZh ? "请输入地址" : "Enter an address.";
    }
    else if (!web3.isAddress(address.trim())){
      return this.props.isZh ? "请输入有效以太币地址" : "Enter a valid ETH address.";
    }
    else if (this.props.notThisAddress.toLowerCase() === address.trim().toLowerCase()){
      return this.props.isZh ? 
        "请注意接收人的地址必须不同于您现在的地址" 
        : 
        "The recipient's address must not be your own address.";
    }
  }
}
