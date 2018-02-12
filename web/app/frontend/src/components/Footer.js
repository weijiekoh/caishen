import { h, Component } from 'preact'

export default class Home extends Component{
  render() {
    return(
      <div class="footer">
        {this.props.isZh ?
          <p>
            支持我们， 商务合作，媒体报道 - <a 
              target="_blank"
              href="mailto:questions@smarthongbao.com">questions@smarthongbao.com</a>
            <br />
            <a target="_blank" href="https://github.com/weijiekoh/caishen">
              源代码</a> | <a target="_blank" href="https://smarthongbao.us17.list-manage.com/subscribe?u=42144641b785b567481776096&id=b9a0fe1fe5">订阅邮件</a>
          </p>
          :
          <p>
            Support, business, and media enquiries - <a 
              target="_blank"
              href="mailto:questions@smarthongbao.com">questions@smarthongbao.com</a>
            <br />
            <a target="_blank" href="https://github.com/weijiekoh/caishen">
              Source code</a> | <a target="_blank" href="https://smarthongbao.us17.list-manage.com/subscribe?u=42144641b785b567481776096&id=b9a0fe1fe5">Subscribe to our mailing list</a>

          </p>
        }
      </div>
    )
  }
}
