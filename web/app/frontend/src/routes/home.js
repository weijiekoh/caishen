import { h, Component } from 'preact'
import { route } from "preact-router"; 

export default class Home extends Component{
  renderGiftBtn = eng => {
    const gen = (t1, t2) => {
      return (
        <div class="get_started">
          <button 
            onClick={() => { route("/deposit") }}
            class="pure-button button-success">
            {t1}
          </button>
          {t2}
        </div>
      );
    }

    if (eng){
      const t1 = "Give a smart red packet"
      const t2 = <p>or <a href="/about">learn more</a> about this dApp.</p>
      return gen(t1, t2);
    }
    else{
      const t1 = "赠送智能红包";
      const t2 = <p>或者<a href="/about">了解更多</a>关于这个分布式应用。</p>
      return gen(t1, t2);
    }
  }


  render() {
    return (
      <div>
        <p>这个农历新年，与下一代共享未来。</p>
        <p>使用此分布式应用创建带时间锁的智能红包。 收件人只能在锁定时间到期后才能使用资金。</p>
        <p>这些资金由以太坊区块链担保。 只有你或收件人可以获得资金。</p>

        {this.renderGiftBtn(false)}

        <p>
          This Lunar New Year, share the future with the next generation.
        </p>
        <p>
          Use this dApp to create a smart red packet with a time-lock.
          The recipient can only spend the funds after the time-lock expires.
        </p>
        <p>
          The funds are secured by 
          the <a href="https://www.ethereum.org/">Ethereum</a> blockchain. Only 
          you or the recipient may access the funds.
        </p>
        {this.renderGiftBtn(true)}
      </div>
    );
  }
}
