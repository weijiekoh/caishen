import { h, Component } from 'preact'

export default class Home extends Component{
  render() {
    const sourceLink = (
      <a target="_blank" href="https://github.com/weijiekoh/caishen">
        {this.props.isZh ?  "源代码" : "Source code"}
      </a>
    );

    const emailLink = (
      <a target="_blank" 
        href="mailto:questions@smarthongbao.com">questions@smarthongbao.com</a>
    );

    const enqText = this.props.isZh ? 
      "技术支持， 商务合作，媒体咨询：" 
      : 
      "Support, business, and media enquiries - ";

    const subscribeLink = (
      <a target="_blank"
        href="https://smarthongbao.us17.list-manage.com/subscribe?u=42144641b785b567481776096&id=b9a0fe1fe5">
        {this.props.isZh ? "订阅邮件" : "Subscribe to our mailing list"}
      </a>
    );

    return(
      <div class="footer">
        <p>
          {enqText}{emailLink}
          <br />
          {sourceLink} | {subscribeLink}
        </p>
      </div>
    )
  }
}
