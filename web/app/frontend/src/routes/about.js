import { h, Component } from 'preact'

export default class About extends Component{
  static renderFeeTable = () => {
    return (
      <div>
        <table class="pure-table pure-table-bordered">
          <thead>
            <tr>
              <th>Amount</th>
              <th>One-time fee</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0.01 ETH and below</td>
              <td>Free forever</td>
            </tr>
            <tr>
              <td>Above 0.01 ETH</td>
              <td>1%</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }


  render() {
    return (
      <div class="about">
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
          Since the smart contract lives on the Ethereum blockchain, the
          recipient can redeem the funds even if this website does not exist by
          the time the expiry date passes.
        </p>

        <h2>Fee structure</h2>

        <p>
          The fees for using this smart contract are very modest and will be
          used to cover hosting costs.
        </p>

        {this.constructor.renderFeeTable()}

        <h2>Frequently asked questions</h2>

        <h3>
          What is a red packet?
        </h3>
        <p>
          In many Asian cultures, it is customary for elders to give packets of
          money to unmarried or younger relatives. More information about this
          tradition can be found <a
            href="https://en.wikipedia.org/wiki/Red_envelope">on Wikipedia</a>.
        </p>

        <h3>
          Why are these red packets "smart"?
        </h3>
        <p>
          The Ethereum blockchain makes it possible to make financial
          transactions according to smart contracts. These contracts are
          carried out exactly as they are programmed, and you do not need to
          trust any single central entity that this will happen.  See the <a
            href="https://www.ethereum.org/">Ethereum website</a> for more
          information.
        </p>
        <p>
          CaiShen is one such smart contract. When you give a smart red packet to
          someone using CaiShen, the recipient can only redeem the funds after the
          expiry date you set. This is because CaiShen is programmed to
          <em>only</em> release funds to the recipient after said expiry date.
        </p>

        <h3>
          Why can't I just use a trust fund?
        </h3>
        <p>
          That's completely up to you. The value that CaiShen brings to the
          table, however, is decentralisation and disintermediation. That means
          that you don't have to go through a third party to give or receive 
          a smart red packet, and you don't have to trust anyone for the smart
          contract to execute as programmed.
        </p>

        <h3>
          At what time on the expiry date may I redeem the funds?
        </h3>
        <p>
          If the giver used this web interface to send the funds, the expiry
          time will be midnight in their timezone. For instance, if a giver
          used this website to send the funds on a computer that is configured
          to use the GMT+8 timezone, the red packet may be redeemed on or after
          the date they specified at 00.00 GMT+8.
        </p>

        <h3>
          Are my funds safe?
        </h3>
        <p>
          While we have exercised due care and diligence to ensure that this
          smart contract is secure, we provide it as-is, with no warranties or
          guarantees of any kind, express or implied.
        </p>


        {/*
        <h3>Is this smart contract safe?</h3>
        <p>
        </p>
        <h3>What if this site goes down? How can I redeem my red packet?</h3>
        <p>
          You can redeem your red packet even if this website disappears
          because the underlying Ethereum smart contract will run on the
          Ethereum blockchain forever.
        </p>

        <p>
          To redeem your red packet manually,
          follow <a href="redeem/manual">these instructions</a>.
        </p>
        */}

        <h2>Source code</h2>
        <p>The source code of the smart contract can be 
          viewed <a href="https://github.com/weijiekoh/caishen">here</a>.</p>

      </div>
    )
  }
}
