import { h, Component } from 'preact'
import Input from "./Input.js";

export default class EthAmountInput extends Input{
  fee = amount => {
    let result;
    if (amount <= 0.01){
      result = 0;
    } 
    else if (amount > 0.01){
      result = amount / 100;
    } 
    return result;
  }

  validate = amount => {
    // Reject null or empty values
    if (amount == null || amount.trim().length == 0){
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

    // Reject negative values
    const parsedAmt = parseFloat(amount, 10);
    if (parsedAmt <= 0){
      return false;
    }

    // Reject amounts smaller than the maximum
    if (this.lessThanMax(parsedAmt)){
      return false;
    }
  }


  lessThanMax = amount => {
    const parsedAmt = parseFloat(amount, 10);

    return typeof this.props.maximum !== "undefined" &&
        this.props.maximum != null &&
        this.props.maximum.lessThan(web3.toWei(parsedAmt + this.fee(parsedAmt), "ether"));
  }


  genErrorMsg = amount => {
    if (amount == null || amount.trim().length == 0){
      return "Enter a value.";
    }

    try{
      web3.fromDecimal(amount);
    }
    catch (err){
      return "Enter a valid number.";
    }

    if (amount <= 0){
      return "Enter a positive value.";
    }
    else if (this.lessThanMax(amount)){
      return "You don't have enough ETH.";
    }
  }
}
