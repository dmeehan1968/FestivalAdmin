import React, { useRef } from 'react'
import { Mutation, graphql } from 'react-apollo'

import eventAddMutation from 'app/graphql/eventAddMutation'
import eventsQuery from 'app/graphql/eventsQuery'

export const EventAddForm = ({
  mutate: eventAdd = () => console.error('eventAdd not passed in component props'),
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
    <form onSubmit={handleSubmit}>
      <label>Title</label>
      <input type="text" ref={eventTitleRef} />
      <button type="submit">Add Event</button>
    </form>
  )
}

export default graphql(eventAddMutation, {
  options: {
    update: (cache, { data: { eventAdd: event } }) => {
      try {
        const { events } = cache.readQuery({ query: eventsQuery })
        cache.writeQuery({
          query: eventsQuery,
          data: { events: [...events, event ]}
        })
      } catch(err) {
        console.log(err);
      }
    },
  },
})(EventAddForm)
