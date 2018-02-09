import { h, Component } from 'preact'
import ShortTextInput from "./ShortTextInput.js";

export default class LongTextInput extends ShortTextInput{
  validate = text => {
    return typeof text !== "undefined" &&
           text != null &&
           text.length < this.props.maxLength;
  }


  genErrorMsg = text => {
    if (text != null && text.length > this.props.maxLength){
      const eng = "Up to " + this.props.maxLength.toString() +
        " characters only.";
      const zh = "仅限" + this.props.maxLength.toString() +
        "字符以内";

      return this.props.isZh ? zh : eng;
    }
  }


  render() {
    let inputParentClass = "pure-u-sm-1-1 pure-u-md-3-4";
    let errorParentClass = "pure-u-sm-1-1 pure-u-md-1-1";

    return (
      <div class="input_component">
        <label for={this.props.name}>
          {this.props.label}
        </label>

        <div class={inputParentClass}>
          <textarea 
            onKeyDown={this.handleOnKeyDown}
            onInput={this.handleChange}
            onChange={this.handleChange}
            value={this.state.value}
            name={this.props.name}
            type="text" />
        </div>

        {this.props.showErrorMsgs &&
          <div class={errorParentClass}>
              <span class="error">
                {this.genErrorMsg(this.state.value)}
              </span>
          </div>
        }
      </div>
    );
  }
}
