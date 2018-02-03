import { h, Component } from 'preact'


export default class Redeem extends Component{
  render() {
    return (
      <div class="return_funds">
        <fieldset>
          <button 
            onClick={this.handleReturnFundsClick}
            class="pure-button button-primary">
            Return funds
          </button>
        </fieldset>
      </div>
    );
  }
}
