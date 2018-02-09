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

    // Reject hex values
    if (amount.toString().startsWith("0x")){
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
      return this.props.isZh ? "请输入数字" : "Enter a value.";
    }

    // Reject hex values
    if (amount.toString().startsWith("0x")){
      return this.props.isZh ? "请输入有效数字" : "Enter a valid number.";
    }

    try{
      web3.fromDecimal(amount);
    }
    catch (err){
      return this.props.isZh ? "请输入有效数字" : "Enter a valid number.";
    }

    if (amount <= 0){
      return this.props.isZh ? "请输入正数" : "Enter a positive value.";
    }
    else if (this.lessThanMax(amount)){
      return this.props.isZh ? "您的以太币余额不足" : "You don't have enough ETH.";
    }
  }
}
