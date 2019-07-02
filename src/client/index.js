import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import AdminApp from 'app/components/AdminApp'
import AuthenticationProvider from 'app/components/AuthenticationProvider'

import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo-hooks'

export const client = ({
  document = global.document,
  render = ReactDOM.render,
  console = global.console,
  module: mod = module,
} = {}) => {

  const client = new ApolloClient()

  render((
    <ApolloProvider client={client}>
      <AuthenticationProvider>
        <BrowserRouter>
          <AdminApp />
        </BrowserRouter>
      </AuthenticationProvider>
    </ApolloProvider>
  ),
  document.getElementById('root'))

  if (mod && mod.hot) {
    mod.hot.accept()
  }

}

if (!module.parent) {
  client()
}
