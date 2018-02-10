import { h, Component } from 'preact'

export default class Home extends Component{
  render() {
    return(
      <div class="footer">
        <p>
          questions@smarthongbao.com
        </p>
        {this.props.isZh ?
          <p>© 财神{new Date().getFullYear()}</p>
          :
          <p>© CaiShen {new Date().getFullYear()}</p>
        }
      </div>
    )
  }
}
