import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, withRouter } from 'react-router-dom'

import AdminApp from 'app/components/AdminApp'
import { default as _AuthenticationProvider, useAuthStorage } from 'app/components/AuthenticationProvider'
const AuthenticationProvider = withRouter(_AuthenticationProvider)

import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo-hooks'

export const client = ({
  document = global.document,
  render = ReactDOM.render,
  console = global.console,
  module: mod = module,
} = {}) => {

  const store = useAuthStorage(window.sessionStorage)

  const client = new ApolloClient({
    request: operation => {
      const token = store.getItem()
      operation.setContext({
        headers: {
          authorization: token ? `Bearer: ${token}` : '',
        }
      })
    },
  })

  render((
    <ApolloProvider client={client}>
      <BrowserRouter>
        <AuthenticationProvider redirect_url={'/event'}>
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
