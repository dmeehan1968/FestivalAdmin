import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, withRouter } from 'react-router-dom'

import AdminApp from 'app/components/AdminApp'
import { default as _AuthenticationProvider } from 'app/components/AuthenticationProvider'
const AuthenticationProvider = withRouter(_AuthenticationProvider)

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
      <BrowserRouter>
        <AuthenticationProvider>
          <AdminApp />
        </AuthenticationProvider>
      </BrowserRouter>
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
