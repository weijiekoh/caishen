import { h, Component } from 'preact'
import CaiShenContract from '../../../../../build/contracts/CaiShen.json';

export default class ManualRedeem extends Component{
  render() {
    return (
      <div class="manual_redeem">
        <h1>How to manually redeem a smart red packet</h1>


        <h2>Using MyEtherWallet (easy)</h2>

        <p>
          Navigate to <a href="https://www.myetherwallet.com/#contracts">
            the contracts tab at MyEtherWallet.com</a>, and enter the 
          CaiShen contract address into the Contract Address field.

          If you are using the mainnet, use this address:
          <pre>TBC</pre>

          If you are using the Ropsten testnet, select "Network Ropsten" from
          the drop-down menu on the top right corner of the page and use this
          address:
          <pre>
            0x805B827E1cc082697F1e578EE8e286E6e5C53227
          </pre>
        </p>

        <p>Next, copy and paste the contract ABI into the ABI / JSON Interface field.</p>
        <textarea readonly>
          {JSON.stringify(CaiShenContract.abi)}
        </textarea>

        <p>The ABI can also be
          found <a href="https://ropsten.etherscan.io/address/0x805B827E1cc082697F1e578EE8e286E6e5C53227#code">on Etherscan</a> (Ropsten).</p>
        <p>Click the Access button.</p>

        <h2>Get gift IDs</h2>
        <p>
          Enter the ETH address of the recipient and click the Read button. A list of
          numbers should appear. These are the IDs of each gift the recipient has been
          given.
        </p>

        <h2>Claim each gift</h2>

        <p>
          Select "redeem" from the dropdown menu and then follow the instructions to
          connect to the recipient's account, whether through MetaMask, your
          Ledger, a private key, or any other method that MyEtherWallet provides.
        </p>

        <p>
          Enter the first gift ID and click the Write button.
        </p>

        <h2>Trigger the function manually (advanced)</h2>

        <p>
          Advanced users may choose to use any means they wish to call the
          following function of the smart contract manually:

          For the Ropsten network:
          <pre>
            Function: redeem(uint256 _value)
          </pre>
          <pre>
            MethodID: 0xdb006a75
          </pre>

          Where _value is the gift ID.
        </p>

      </div>
    );
  }
}
