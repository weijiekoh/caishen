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
              <td>0%</td>
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
          CaiShen allows you to give your loved ones an Ethereum red packet
          that which can only be opened after a specified date. Like a time
          capsule, the recipient can only withdraw the Ethereum after the
          opening date you set.
        </p>

        <h2>The technology behind CaiShen</h2>

        <p>
          CaiShen is based upon the Ethereum smart contract technology.  A
          smart contract is a computer program that runs on the blockchain. A
          smart contract will execute the instructions encoded precisely,
          without censorship, and without a trusted intermediary. 
        </p>

        <p>
          For example, our CaiShen smart contract will only allow the funds
          to be withdrawn on or after the opening date, because the contract is
          coded as such. If you set the opening date to 1st January 2020, the
          recipient of the red packet can only redeem the funds on or after 1st
          January 2020.
        </p>
          
        <p>
          CaiShen is a dApp (“distributed application”). Only the user
          interface lives on our servers. However, the smart contract — the
          heart of the application — resides on the Ethereum blockchain.  This
          means that the assets and functionality of CaiShen is safe even when
          the creators (ourselves) cease to exist.
        </p>

        <h2>The CaiShen team</h2>
        <ul>
          <li>Kelvin Quee</li>
          <li>Koh Wei Jie</li>
          <li>Rohan Naidu</li>
          <li>Sun Yuanxin</li>
        </ul>

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
          transactions according to predefined rules. These contracts are
          carried out exactly as they are programmed, and you do not need to
          trust any human or central entity for this to happen. See the <a
            href="https://www.ethereum.org/">Ethereum website</a> for more
          information.
        </p>
        <p>
          CaiShen is one such smart contract. When you give a smart red packet to
          someone using CaiShen, the recipient can only redeem the funds after the
          opening date you set. This is because CaiShen is programmed to <em>
          only</em> release the recipient's funds after the opening date.
        </p>

        <h3>
          Will you steal my money?
        </h3>
        <p>
          No. The funds are locked by the contract code and will only be
          released to the owner of the recipient’s private key. Not even we can
          access the funds. The entire creation of your Ethereum address, your
          recipient’s Ethereum address, and the creation of the contract takes
          place in your browser.
        </p>
        <p>
          Only the person who owns a recipient's private keys can redeem a
          red packet.
        </p>

        <h3>
          What if your website does not exist anymore?
        </h3>

        <p>
          CaiShen is a dApp (“distributed application”) and exists whereever
          there is an Ethereum node. As long as the Ethereum network exists,
          your red packet will always be around with its funds, <em>with or
          without us</em>.
        </p>

        <h3>
          Is your code safe?
        </h3>

        <p>
          Our contract code has been reviewed by as many developers as
          possible.
        </p>



        <h3>
          I forgot my wallet password.
        </h3>

        <p>
          Unfortunately, we cannot help with retrieving your old password or to
          reset your password.
        </p>


        <h3>
          My recipient forgot their wallet password or private key.
        </h3>
        <p>
          Unfortunately, we cannot help with retrieving your old password or to
          reset your password.
        </p>

        <h3>
          I sent my funds to the wrong address.
        </h3>
        <p>
          Unfortunately, once the funds are sent they cannot be retrieved. You may try to
          find out who owns that address. We are sorry that we cannot help with that
          process.
        </p>

        <h3>
          I set the wrong withdrawal date.
        </h3>
        <p>
          Unfortunately, we cannot alter the contract date once it has been set.
        </p>

        <h3>
          Why can't I just use a trust fund?
        </h3>
        <p>
          That's completely up to you. The value that CaiShen brings to the
          table, however, is decentralisation and disintermediation. That means
          that you don't have to go through a human third party to give or
          receive a smart red packet, and you don't have to trust anyone for
          the smart contract to execute as programmed.
        </p>

        <h3>
          At what time on the opening date may I redeem the funds?
        </h3>
        <p>
          If the giver used this web interface to send the funds, the opening
          time will be midnight in their timezone. For instance, if a giver
          used this website to send the funds on a computer that is configured
          to use the GMT+8 timezone, the red packet may be redeemed on or after
          the date they specified at midnight, GMT+8.
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
