import React from 'react'

import Event from 'app/components/Event'

export const EventList = ({
  loading,
  error,
  events,
}) => {

  if (loading) {
    return (<div>Loading...</div>)
  }
  if (error) {
    return <div><h1>Error</h1><pre>{JSON.stringify(error, undefined, 2)}</pre></div>
  }

  if (events.length < 1) {
    return <div>No Events</div>
  }

  return events.map(event => <Event key={event.id} event={event} />)
}

export default EventList
