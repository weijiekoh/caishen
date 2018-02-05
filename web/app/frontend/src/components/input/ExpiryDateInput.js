import { h, Component } from 'preact'
import Input from "./Input.js";

import Flatpickr from 'react-flatpickr'
import "flatpickr/dist/themes/airbnb.css"


export default class DateInput extends Component{
  constructor(props) {
    super(props);
    this.state = {
      isValid: true,
      value: null,
    };
  }

  componentWillReceiveProps = newProps => {
    if (this.props.changeCounter !== newProps.changeCounter){
      this.setState({
        isValid: true,
        value: null,
      });
    }
  }


  validate = date => {
    if (date == null){
      return false;
    }

    return Date.now() < date.getTime();
  }


  handleChange = dates => {
    if (dates != null && dates.length > 0){
      const d = dates[0];

      this.setState({
        value: d,
      }, () => {
        this.props.handleChange(d, this.validate(d));
      });
    }
  }


  genErrorMsg = date => {
    if (date == null){
      return "Please select a date.";
    }
    else if (Date.now() > date.getTime()){
      // This shouldn't happen because the datepicker component has a minimum
      // date in its config
      return "Please select a date in the future.";
    }
  }


  render() {
    // Minimum date is midnight of tomorrow
    const minDate = new Date();
    minDate.setHours(0);
    minDate.setMinutes(0);
    minDate.setSeconds(0);
    minDate.setMilliseconds(0);
    minDate.setDate(minDate.getDate() + 1);

    return (
      <div class="input_component">
        <label>
          {this.props.label}
        </label>

        <div class="pure-u-1-1 date_picker">
          <Flatpickr 
            onChange={this.handleChange}
            value={this.state.value}
            options={{
              animate: false,
              inline: true,
              enableTime: false,
              altInput: true,
              minDate: minDate,
            }} />
        </div>

        <div class="pure-u-1-1 date_error">
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
