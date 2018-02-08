import { h, Component } from 'preact'
import Input from "./Input.js";

export default class ShortTextInput extends Input{
  validate = text => {
    return typeof text !== "undefined" &&
           text != null &&
           text.length < this.props.maxLength;
  }


  genErrorMsg = text => {
    if (text != null && text.length > this.props.maxLength){
      return "Up to " + this.props.maxLength.toString() +
        " characters only.";
    }
  }
}
