import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import AdminApp from 'app/components/AdminApp'

export const client = ({
  document = global.document,
  hydrate = ReactDOM.hydrate,
  console = global.console,
  module: mod = module,
} = {}) => {

  hydrate((
    <BrowserRouter>
      <AdminApp />
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
