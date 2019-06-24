import React, { useState, useEffect } from 'react'

import { compose } from 'react-apollo'
import { gql } from 'apollo-boost'

// Styles
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

// Core
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import withApolloQuery from 'app/hocs/withApolloQuery'
import withApolloMutation from 'app/hocs/withApolloMutation'
import withLoading from 'app/hocs/withLoading'
import withMutationProgress from 'app/hocs/withMutationProgress'

import AutoSaveTextField from 'app/components/AutoSaveTextField'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
  },
}))

const isset = fn => {
    var value;
    try {
        value = fn();
    } catch (e) {
        value = undefined;
    } finally {
        return value !== undefined;
    }
}

export const EventDescription = ({
  event,
  eventEdit,
  id,
  updating,
  error,
  ...otherProps
}) => {

  const classes = useStyles()

  return (
    <Paper className={classes.paper}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <AutoSaveTextField
            label="Title"
            value={event.title}
            error={!!error.title}
            helperText={error.title}
            updating={isset(() => updating.title) }
            onChange={ev=>eventEdit({ id, title: ev.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AutoSaveTextField
            label="Sub Title"
            value={event.subtitle}
            error={!!error.subtitle}
            updating={isset(() => updating.event.subtitle) }
            onChange={ev=>eventEdit({ id, subtitle: ev.target.value })}
          />
        </Grid>
      </Grid>
    </Paper>
  )
}

///////////////////////////////////////////////

const eventsQuery = gql`
  query eventsQuery($id: Int) {
    events(id: $id) {
      id
      title
      subtitle
    }
  }
`

const eventEditMutation = gql`
  mutation eventEdit($event: EventInput!) {
    eventEdit(Event:$event) {
      id
      title
      subtitle
    }
  }
`

const eventsQueryOptions = {
  QueryProps: {
    query: eventsQuery
  },

  mapResultToProps: ({
    loading,
    error,
    data: {
      events: [ event ] = []
    } = {}
  }) => ({ loading, error, event }),

  mapPropsToVariables: ({ id }) => ({ id })
}

const eventEditMutationOptions = {
  MutationProps: {
    mutation: eventEditMutation
  },
  mapMutateToProps: mutate => ({
    eventEdit: event => mutate({variables: { event }})
  }),
  mapResultToProps: ({ called, loading, error, data: { eventEdit: event = {} } = {} }, props) => {

    let errorMap = {}

    if (error) {
      error.graphQLErrors.map(e => {
        console.log(e);
        errorMap = e.extensions.exception.errors.reduce((acc,err) => ({ ...acc, [err.path]: e.message }), errorMap)
      })
    }

    return {
      ...props,
      ...(called && !loading && !error && { event } || {}),
      error: errorMap,
    }
  }
}

export default compose(
  withApolloQuery(eventsQueryOptions),
  withApolloMutation(eventEditMutationOptions),
  withLoading(()=><div>Loading...</div>),
  withMutationProgress({ mutationPropName: 'eventEdit', fakeLatencyMs: 0 }),
)(EventDescription)
