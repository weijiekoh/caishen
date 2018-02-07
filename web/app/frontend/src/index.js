import { h, render } from 'preact'
import { IntlProvider } from 'preact-i18n';
import "./styles/index.less";

if (process.env.NODE_ENV === 'development') {
  // Enable use of React Developer Tools
  require('preact/devtools')
}

let root
function init() {
  let App = require('./App').default
  root = render(
    (
      <App />
    ),

    document.querySelector('#app'), root)
}

if (module.hot) {
  module.hot.accept('./App', init)
}

init()
