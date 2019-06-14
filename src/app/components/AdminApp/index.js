import React from 'react'

const dummyEvents = [
  {
    id: 1,
    title: 'my first event',
    contacts: [
      {
        id: 1,
        firstName: 'Joe',
        lastName: 'Blow',
      }
    ]
  },
  {
    id: 2,
    title: 'my second event',
    contacts: [
      {
        id: 2,
        firstName: 'Betty',
        lastName: 'Boop',
      }
    ]
  },
]

export const AdminApp = ({
  events = dummyEvents,
}) => {

  return (
    <section>
      <h1>Events</h1>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            {event.title}
            {event.contacts && event.contacts.length &&
              <ul>
                {event.contacts.map(contact => (
                  <li key={contact.id}>{contact.firstName} {contact.lastName}</li>
                ))}
              </ul>
            }
          </li>
        ))}
      </ul>
    </section>
  )

}

/////////////////////////////////

import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'

export const withApolloClient = WrappedComponent => {
  const Component = props => {
    const client = new ApolloClient({ uri: '/graphql' })
    return (
      <ApolloProvider client={client}>
        <WrappedComponent {...props} />
      </ApolloProvider>
    )
  }
  Component.displayName = `withApolloClient(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`
  return Component
}

///////////////////////////////////

import { Query } from 'react-apollo'

const ApolloLoading = () => <div>Loading...</div>

const ApolloError = ({
  error,
}) => (
  <div>
    <h1>Error</h1>
    <pre>{JSON.stringify(error, undefined, 2)}</pre>
  </div>
)

export const withApolloQuery = (query, options = {}) => WrappedComponent => {
  const defaults = {
    loading: ApolloLoading,
    error: ApolloError,
    spreadData: true,
  }
  const {
    loading: Loading,
    error: Error,
    spreadData,
    queryOptions,
  } = {
    ...defaults,
    ...options,
  }

  const Component = props => {
    return (
      <Query query={query} {...queryOptions}>
        {({ loading, error, data, refetch }) => {
          if (loading) return <Loading />
          if (error) return <Error error={error} refetch={refetch} />
          return <WrappedComponent {...props} {...(spreadData ? data : { data })} />
        }}
      </Query>
    )
  }
  Component.displayName = `withApolloQuery(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`
  return Component
}

///////////////////////////////////

import { gql } from 'apollo-boost'

export default withApolloClient(
  withApolloQuery(gql`{ events { id title contacts { id firstName lastName }}}`)(AdminApp)
)
