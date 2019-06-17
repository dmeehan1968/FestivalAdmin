import React, { useRef } from 'react'
import { useMutation } from 'react-apollo-hooks'

import eventAddMutation from 'app/graphql/eventAddMutation'
import eventsQuery from 'app/graphql/eventsQuery'

export const EventAddForm = ({}) => {

  const eventTitleRef = useRef(null)
  const eventAdd = useMutation(eventAddMutation, {
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
    }
  })

  const handleSubmit = e => {
    e.preventDefault()
    eventAdd({
      variables: {
        event: {
          title: eventTitleRef.current.value,
        },
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

export default EventAddForm
