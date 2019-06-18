import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import AdminAppProvider from 'app/components/AdminApp'

export const client = ({
  document = global.document,
  render = ReactDOM.render,
  console = global.console,
  module: mod = module,
} = {}) => {

  render((
    <BrowserRouter>
      <AdminAppProvider />
    </BrowserRouter>
  ),
  document.getElementById('root'))

  if (mod && mod.hot) {
    mod.hot.accept()
  }

}

if (!module.parent) {
  client()
}
