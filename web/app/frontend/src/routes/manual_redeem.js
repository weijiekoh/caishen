import { h, Component } from 'preact'
import ContentBox from "../components/ContentBox.js";
import CaiShenContract from '../../../../../build/contracts/CaiShen.json';

export default class ManualRedeem extends Component{
  render() {
    return (
      <div class="manual_redeem">
        <ContentBox isZh={this.props.isZh}>
          <h1>How to manually redeem a smart red packet</h1>

          <h2>Using MyEtherWallet (easy)</h2>

          <p>
            Navigate to <a target="_blank" href="https://www.mycrypto.com/#contracts">
              the contracts tab at MyCrypto.com</a>, and enter the 
            CaiShen contract address into the Contract Address field.

            If you are using the mainnet, use this address:
            <pre>0xe507c467c0f63845eadce5516c9ff5e1a5ebb63a</pre>

            If you are using the Ropsten testnet, select "Network Ropsten" from
            the drop-down menu on the top right corner of the page and use this
            address:
            <pre>
              0xc881fdc2368f3b64f832fa9965b4ef3c7d024448
            </pre>
          </p>

          <p>Next, copy and paste the contract ABI into the ABI / JSON Interface field.</p>
          <textarea readonly>
            {JSON.stringify(CaiShenContract.abi)}
          </textarea>

          <p>The ABI can also be
            found <a 
              target="_blank"
              href="https://ropsten.etherscan.io/address/0xc881fdc2368f3b64f832fa9965b4ef3c7d024448#code">
              on Etherscan</a> (Ropsten).</p>
          <p>Click the Access button.</p>

          <h2>Get gift IDs</h2>
          <p>
            Select "getGiftIdsByRecipient" in the dropdown menu, enter the ETH
            address of the recipient, and click the Read button. A list of
            numbers should appear. These are the IDs of each gift the recipient
            has been given.
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
            Advanced users may choose to call the redeem function of the smart
            contract manually:

            <pre>
              Function: redeem(uint256 _value)
            </pre>
            <pre>
              MethodID: 0xdb006a75
            </pre>

            Where _value is the gift ID.
          </p>

        </ContentBox>
    </div>
    );
  }
}
