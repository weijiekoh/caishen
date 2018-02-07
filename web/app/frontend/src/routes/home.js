import { h, Component } from 'preact'
import { route } from "preact-router"; 


export default class Home extends Component{
  render() {
    return (
      <div class="home">
        <div class="concept pure-u-1">
          Concept graphic goes here.
          <p>
            Use CaiShen to give your loved ones an Ethereum red packet that
            which can only be opened after a specified date. Like a time
            capsule, the recipient can only withdraw the cryptocurrency funds
            after the opening date.
          </p>
        </div>

        <div class="pricing pure-u-1">
          <h2>Pricing</h2>
          <table class="pure-table pure-table-bordered">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Fee (%)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><pre>???</pre></td>
                <td><pre>???</pre></td>
              </tr>
              <tr>
                <td><pre>???</pre></td>
                <td><pre>???</pre></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="requirements pure-u-1">
          <h2>What you need</h2>
          <p>
            To use CaiShen, you will need:
          </p>
          <p>
            <ul>
              <li>
                Chrome or Firefox on a desktop computer with the <a target="_blank"
                  href="https://metamask.io/">MetaMask digital wallet</a> installed.
              </li>

              <li>
                Some Ethereum cryptocurrency. You may purchase Ethereum from <a
                  href="https://www.coinbase.com" target="_blank">Coinbase
                  </a> or <a href="https://www.coinhako.com/"
                  target="_blank">Coinhako</a>.
              </li>
              <li>
                Read our <a href="/about" target="_blank">FAQ</a> carefully. We
                will not be able to help you if you forget your wallet
                password, send funds to the wrong address, or set a wrong the
                withdrawal date as everything takes place on the blockchain.
              </li>
            </ul>
          </p>
        </div>

        <div class="terms pure-u-1">
          <h2>Terms and conditions</h2>
          <p>
            CaiShen is a tool which uses the Ethereum blockchain and smart
            contracts technology. It enables you to deposit an amount of funds,
            denominated in Ethereum, that can only be withdrawn after a certain
            time using a specific private key.
          </p>

          <p> CaiShen is not a financial institution as we do not store any of
            your funds. Nor is it a payment processor as we do not process any
            of your funds.
          </p>

          <p>
            As such, CaiShen will not and cannot be responsible for the long term
            viability of your funds or the eventual security of your funds. We
            are and can only be responsible for the design of the deposit of
            the Ethereum funds and the design of the smart contract.
          </p>
        </div>
      </div>
    );
  }
}
