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
    if (!this.props.blank && newProps.blank){
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
    let inputParentClass = "pure-u-sm-1-1 pure-u-md-3-4";
    let errorParentClass = "pure-u-sm-1-1 pure-u-md-1-4";

    if (this.props.smallerInput){
      inputParentClass = "pure-u-sm-1-1 pure-u-md-2-5";
      errorParentClass = "pure-u-sm-1-1 pure-u-md-3-5";
    }


    return (
      <div class="input_component">
        <label for={this.props.name}>
          {this.props.label}
        </label>

        <div class={inputParentClass}>
          <input 
            onKeyDown={this.handleOnKeyDown}
            onInput={this.handleChange}
            onChange={this.handleChange}
            value={this.state.value}
            name={this.props.name}
            type="text" />
        </div>

        <div class={errorParentClass}>
          {this.props.showErrorMsgs &&
            <span class="error">
              {this.genErrorMsg(this.state.value)}
            </span>
          }
        </div>
      </div>
    );
  }
}
