import { h, Component } from 'preact'
import { route } from "preact-router"; 

export default class Home extends Component{
  renderGiftBtn = eng => {
    const gen = t => {
      return (
        <div class="get_started">
          <button 
            onClick={() => { route("/deposit") }}
            class="pure-button button-success">
            {t}
          </button>
        </div>
      );
    }

    if (eng){
      const t = "Give a smart red packet"
      return gen(t);
    }
    else{
      const t = "赠送智能红包";
      return gen(t);
    }
  }


  render() {
    return (
      <div class="pure-u-1">
        <p>这个农历新年，与下一代分享财务的未来。</p>
        <p>使用此分布式应用创建带时间锁的智能红包。 
          收金人只能在时间到期后才能收到款项。
        </p>
        <p>这些资金在<a target="_blank" href="https://www.ethereum.org/">以太坊区块链</a>
          上是安全的。 只有收金人可以获得以太资金。</p>

        {this.renderGiftBtn(false)}
        <p>或者<a href="/about">了解更多</a>关于这个分布式应用。</p>

        <hr />

        <p>
          This Lunar New Year, share the future of finance with the next
          generation.
        </p>
        <p>
          Use this dApp to create a smart red packet with a time-lock.
          The recipient can only receive the funds after the time-lock expires.
        </p>
        <p>
          The funds are secure on
          the <a target="_blank" href="https://www.ethereum.org/">Ethereum</a> blockchain. Only 
          the recipient may access the Ether funds.
        </p>
        {this.renderGiftBtn(true)}
        <p>or <a href="/about">learn more</a> about this dApp.</p>
      </div>
    );
  }
}
