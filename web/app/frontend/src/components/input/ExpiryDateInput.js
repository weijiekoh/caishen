import { h, Component } from 'preact'
import Input from "./Input.js";

export default class DateInput extends Input{
  static parseDate = value => {
    const sp = value.trim().split("/");
    const day = parseInt(sp[0], 10);
    const month = parseInt(sp[1], 10);
    const year = parseInt(sp[2], 10);
    return new Date(year, month-1, day);
  }

  validate = expiry => {
    try{
      const sp = expiry.trim().split("/");
      if (sp.length !== 3) throw "Wrong date format";
      if (sp[0].length > 2 || sp[0].length === 0) throw "Wrong day format";
      if (sp[1].length > 2 || sp[1].length === 0) throw "Wrong month format";
      if (sp[2].length !== 4) throw "Wrong year format";

      const day = parseInt(sp[0], 10);
      const month = parseInt(sp[1], 10);
      const year = parseInt(sp[2], 10);

      if ([day, month, year].some(isNaN)) throw "NaN";
      if (day > 31 || day < 1) throw "Invalid day";
      if (month > 12 || month < 1) throw "Invalid month";
      //if (year < (new Date()).getFullYear()) throw "Invalid year";

      if ([4, 6, 9, 11].some(x => x === month)){
        if (day > 30) throw "Invalid day";
      }
      if (month == 2){
        if (new Date(year, 1, 29).getDate() === 29){
          if (day > 29) throw "Invalid day due to leap year";
        }
        else{
          if (day > 28) throw "Invalid day due to leap year";
        }
      }

      // Validate using unix time conversion and parsing
      const p = new Date(new Date(year, month-1, day).getTime());
      if (year !== p.getFullYear()) throw "Invalid year";
      if (month !== p.getMonth() + 1) throw "Invalid month";
      if (day !== p.getDate()) throw "Invalid day";

      return true;
    }
    catch(err){
      return false;
    }
  }

  genErrorMsg = expiry => {
    if (expiry == null || expiry.trim().length == 0){
      return "Enter a date.";
    }
    else if (!this.validate(expiry)){
      return "Please enter a valid date.";
    }
    else if (this.constructor.parseDate(expiry).getTime() < Date.now()){
      return "Please enter a date in the future.";
    }
  }
}
