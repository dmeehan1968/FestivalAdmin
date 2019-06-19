import React from 'react'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import EventCard from 'app/components/EventCard'

export const EventsGrid = ({
  events = [],
}) => {
  return (
    <Grid container spacing={3}>
      {events.length && events.map(event => {
        return (
          <Grid key={event.id} item xs={3}>
            <EventCard event={event} />
          </Grid>
        )
      }) || <Typography>No Events</Typography>}
    </Grid>
  )
}

export default EventsGrid
