import React, { useRef } from 'react'

export const AdminApp = ({
  events = [],
  eventAdd = () => {},
}) => {
  const eventTitleRef = useRef(null)

  const handleSubmit = e => {
    e.preventDefault()
    eventAdd({
      variables: {
        event: {
          title: eventTitleRef.current.value
        }
      }
    })
    eventTitleRef.current.value = ''
  }

  return (
    <section>
      <h1>Events</h1>
      {events && events.length &&
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
              || null}
            </li>
          ))}
        </ul>
      || null}
      {(!events || !events.length) &&
        <div>No Events</div>
      || null}
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input type="text" ref={eventTitleRef} />
        <button type="submit">Add Event</button>
      </form>
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

import { Mutation } from 'react-apollo'

export const withApolloMutation = (mutation, options) => WrappedComponent => {
  const defaults = {
    propName: 'mutate',
  }
  const {
    propName,
  } = {
    ...defaults,
    ...options,
  }
  const Component = props => {
    return (
      <Mutation
        mutation={mutation}
        update={(cache, { data: { [propName]: result } }) => {
          const { events } = cache.readQuery({ query: Events })
          cache.writeQuery({
            query: Events,
            data: { events: [...events, result ]}
          })
          console.log(result, events);
        }}
      >
        {( mutate, { data }) => (
          <WrappedComponent {...props} {...{ [propName]: mutate }} />
        )}
      </Mutation>
    )
  }
  Component.displayName = `withApolloMutation(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`
  return Component
}


///////////////////////////////////

import { gql } from 'apollo-boost'

const Events = gql`
  {
    events
    {
      id
      title
      contacts {
        id
        firstName
        lastName
      }
    }
  }
`

const EventAdd = gql`
  mutation EventAdd($event: EventInput!) {
    eventAdd(Event:$event) {
      id
      title
      contacts {
        firstName
        lastName
      }
    }
  }
`

export default withApolloClient(
  withApolloQuery(Events)(
    withApolloMutation(EventAdd, { propName: 'eventAdd' })(AdminApp)
  )
)
