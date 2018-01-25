import { h, Component } from 'preact'

export default class Nav extends Component{
  render() {
    return (
      <div class="nav">
        <nav>
          <a href="/deposit">Deposit</a>
          <a href="/redeem">Redeem</a>
          <a href="/about">About</a>
        </nav>
      </div>
    );
  }
}
