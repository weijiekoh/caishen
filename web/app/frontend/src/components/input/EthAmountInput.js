import { h, Component } from 'preact'
import Input from "./Input.js";

export default class EthAmountInput extends Input{
  validate = amount => {
    // Reject null or empty values
    if (amount == null || amount.trim().length == 0){
      return false;
    }

    // Reject negative values
    const parsedAmt = parseFloat(amount, 10);
    if (parsedAmt <= 0){
      return false;
    }

    // Reject amounts smaller than the maximum
    if (this.lessThanMax(parsedAmt)){
      return false;
    }

    // Reject non-numeric values
    try{
      web3.fromDecimal(amount);
      return true;
    }
    catch(err){
      return false;
    }
  }


  lessThanMax = amount => {
    return typeof this.props.maximum !== "undefined" &&
        this.props.maximum != null &&
        this.props.maximum.lessThan(web3.toWei(amount, "ether"));
  }


  genErrorMsg = amount => {
    if (amount == null || amount.trim().length == 0){
      return "Enter a value.";
    }
    else if (amount <= 0){
      return "Enter a positive value.";
    }
    else if (this.lessThanMax(amount)){
      return "You don't have enough ETH.";
    }
  }
}
