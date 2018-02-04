import { h, Component } from 'preact'

export default class About extends Component{
  render() {
    return (
      <div class="about">
        <h1>About CaiShen</h1>
        <p>
          CaiShen is a smart contract on the Ethereum blockchain. With this
          dApp, you can give Ether to someone else in a way that they can only
          recieve it after a specified date.
        </p>
        <p>
          This is just like placing money in a trust fund. Since the funds are
          time-locked, your smart red packet is an investment into someone's
          future.
        </p>
        <p>
          To receive the funds after the expiry date, the recipient must remain
          in control of their wallet's private key. If they are too young or
          unable to do so, you may choose to keep it in cold storage for them.
        </p>
        <p>
          The recipient, or whomever has the recipient's private key, may
          change the redemption address to a new one. In turn, the
          private key of that new address must be kept safe, at least until the
          funds are redeemed.
        </p>
        <p>
          Since the smart contract lives on the Ethereum blockchain, the
          recipient can redeem the funds even if this website does not exist by
          the time the expiry date passes.
        </p>

        <h2>Fee structure</h2>

        <p>
          The fees for using this smart contract are very modest and will be
          used to cover hosting costs.
        </p>

        <table class="pure-table pure-table-bordered">
          <thead>
            <tr>
              <th>Range (ETH)</th>
              <th>Fee (%)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><pre>amount &lt; 0.01</pre></td>
              <td><pre>0</pre></td>
            </tr>
            <tr>
              <td><pre>0.01 &lt;= amount &lt; 0.1</pre></td>
              <td><pre>0.001</pre></td>
            </tr>
            <tr>
              <td><pre>0.1 &lt;= amount &lt; 1</pre></td>
              <td><pre>0.01</pre></td>
            </tr>
            <tr>
              <td><pre>amount &gt;= 1</pre></td>
              <td><pre>0.1</pre></td>
            </tr>
          </tbody>
        </table>

        <h2>Source code</h2>
        <p>The source code of the smart contract can be 
          viewed <a href="https://github.com/weijiekoh/caishen">here</a>.</p>

      </div>
    )
  }
}
