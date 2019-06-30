import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import AdminAppProvider from 'app/components/AdminApp'
import AuthenticationProvider from 'app/components/AuthenticationProvider'

export const client = ({
  document = global.document,
  render = ReactDOM.render,
  console = global.console,
  module: mod = module,
} = {}) => {

  render((
    <AuthenticationProvider>
      <BrowserRouter>
        <AdminAppProvider />
      </BrowserRouter>
    </AuthenticationProvider>
  ),
  document.getElementById('root'))

  if (mod && mod.hot) {
    mod.hot.accept()
  }

}

if (!module.parent) {
  client()
}
