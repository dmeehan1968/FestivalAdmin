import React from 'react'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'

import EventList from 'app/components/EventList'
import EventAddForm from 'app/components/EventAddForm'

export const AdminApp = ({
}) => {
  return (
    <section>
      <h1>Events</h1>
      <EventList />
      <EventAddForm />
    </section>
  )
}

export const AdminAppProvider = props => {
  const client = new ApolloClient()
  return (
    <ApolloProvider client={client}>
      <AdminApp {...props} />
    </ApolloProvider>
  )
}

export default AdminAppProvider
