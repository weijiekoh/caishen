import { h, Component } from 'preact'


export default class Input extends Component{
  constructor(props) {
    super(props);
    this.state = {
      isValid: true,
      value: "",
    };
  }


  componentWillReceiveProps = newProps => {
    if (this.props.changeCounter !== newProps.changeCounter){
      this.setState({
        isValid: true,
        value: "",
      });
    }
  }


  handleOnKeyDown = e => {
    if (e.keyCode == 13){
      this.props.handleEnterKeyDown();
    }
  }


  handleChange = e => {
    const callback = (value, valid) => {
      this.props.handleChange(value, valid);
    };

    const value = e.target.value;

    if (this.validate(value)){
      this.setState({ 
        value: value,
        isValid: true,
        errorMsg: "",
      }, () => callback(value, true));
    }
    else{
      this.setState({
        value: value,
        isValid: false,
        errorMsg: this.genErrorMsg(value),
      }, () => callback(value, false));
    }
  }

  render() {
    const formatFee = fee => {
      let f = fee.toFixed(8);
      while(true) {
        if (f[f.length-1] === "0"){
          f = f.slice(0, f.length-1);
        }
        else if (f[f.length-1] === "."){
          f = f.slice(0, f.length-1);
          break;
        }
        else{
          break;
        }
      }
      return f;
    }

    let feeLabel = null;
    const blankFeeLabel = (<p>&nbsp;</p>);
    if (typeof this.props.showFee !== "undefined"){
      if (this.props.showFee){
        if (this.state.isValid){
          feeLabel = (
            this.props.isZh ?
              <p>
                手续费： {formatFee(this.fee(this.state.value))} ETH (<a target="_blank" href="/about#fees">
                  查看费率表</a>)
              </p>
              :
              <p>
                Fee: {formatFee(this.fee(this.state.value))} ETH (<a target="_blank" href="/about#fees">
                  see rates</a>)
              </p>
          );
        }
        else{
          feeLabel = blankFeeLabel;
        }
      }
      else{
        feeLabel = blankFeeLabel;
      }
    }

    let inputParentClass = "pure-u-sm-1-1 pure-u-md-3-4";
    let errorParentClass = "pure-u-sm-1-1 pure-u-md-1-1";

    if (this.props.smallerInput){
      inputParentClass = "pure-u-sm-1-1 pure-u-md-2-5";
      errorParentClass = "pure-u-sm-1-1 pure-u-md-3-3";
    }


    return (
      <div class="input_component">
        <label for={this.props.name}>
          {this.props.label}
        </label>

        {feeLabel != null && feeLabel}

        <div class={inputParentClass}>
          <input 
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
