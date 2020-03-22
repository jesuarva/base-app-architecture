import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { enableAllPlugins } from 'immer'
import initServices from 'services/initService'
import App from 'components/App'
import 'scss/index.scss'
import * as serviceWorker from './serviceWorker'

const HOST = process.env.SERVICE_HOST || 'http://localhost:3333'

initServices(HOST)
enableAllPlugins()

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
