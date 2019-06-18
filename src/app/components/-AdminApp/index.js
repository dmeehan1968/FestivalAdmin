import React from 'react'
import ApolloClient from 'apollo-boost'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'

import EventList from 'app/components/EventList'
import EventAddForm from 'app/components/EventAddForm'

import { useQuery, useMutation } from 'react-apollo-hooks'
import eventsQuery from 'app/graphql/eventsQuery'
import eventAddMutation from 'app/graphql/eventAddMutation'

const useEventsQuery = () => {
  const { loading, error, data: {events = []} = {} } = useQuery(eventsQuery)
  return { loading, error, events }
}

const useEventAddMutation = () => {
  const mutate = useMutation(eventAddMutation, {
    update: (cache, { data: { eventAdd: event }}) => {
      const { events } = cache.readQuery({ query: eventsQuery })
      events.push(event)
      cache.writeQuery({ query: eventsQuery, data: { events }})
    },
  })
  return event => {
    mutate({ variables: { event } })
  }
}

export const AdminApp = ({
}) => {
  const { loading, error, events } = useEventsQuery()
  const eventAdd = useEventAddMutation()

  return (
    <section>
      <h1>Events</h1>
      <EventList loading={loading} error={error} events={events} />
      <EventAddForm eventAdd={eventAdd} />
    </section>
  )
}

export const AdminAppProvider = props => {
  const client = new ApolloClient()
  return (
    <ApolloHooksProvider client={client}>
      <AdminApp {...props} />
    </ApolloHooksProvider>
  )
}

export default AdminAppProvider
