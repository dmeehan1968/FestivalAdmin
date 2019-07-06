import React from 'react'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import EventCard from 'app/components/EventCard'
import EventCreateCard from 'app/components/EventCreateCard'

export const EventsGrid = ({
  events = [],
}) => {
  return (
    <Grid container spacing={3}>
      <Grid key={-1} item xs={3}>
        <EventCreateCard />
      </Grid>
      {events.length && events.map((event, key) => {
        return (
          <Grid key={key} item xs={3}>
            <EventCard event={event} />
          </Grid>
        )
      }) || null}
    </Grid>
  )
}

export default EventsGrid
