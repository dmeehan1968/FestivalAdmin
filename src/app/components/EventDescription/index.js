import React, { useState, useEffect } from 'react'

import { Query, Mutation, compose } from 'react-apollo'
import { gql } from 'apollo-boost'

// Styles
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

// Core
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import CircularProgress from '@material-ui/core/CircularProgress'
import Snackbar from '@material-ui/core/Snackbar'

import withApolloQuery from 'app/hocs/withApolloQuery'
import withApolloMutation from 'app/hocs/withApolloMutation'
import withProps from 'app/hocs/withProps'
import withOnChangeDebounce from 'app/hocs/withOnChangeDebounce'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
  },
}))

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
    return {
      ...props,
      ...(called && !loading && !error && { event } || {})
    }
  }
}

export const EventDescription = ({
  event,
  eventEdit,
  id,
  updating,
  ...otherProps
}) => {

  const classes = useStyles()

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

  return (
    <Grid container spacing={3} direction="column">
      <Grid item xs={12} md={6}>
        <Paper className={classes.paper}>
          <AutoSaveTextField
            label="Title"
            value={event.title}
            updating={isset(() => updating.event.title) }
            onChange={ev=>eventEdit({ id, title: ev.target.value })}
          />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper className={classes.paper}>
          <AutoSaveTextField
            label="Sub Title"
            value={event.subtitle}
            updating={isset(() => updating.event.subtitle) }
            onChange={ev=>eventEdit({ id, subtitle: ev.target.value })}
          />
        </Paper>
      </Grid>
    </Grid>
  )
}


const withMutateProgress = ({ fakeLatencyMs = 0 }) => {

  const EnhancedComponent = WrappedComponent => ({
    mutate,
    onBeginUpdate,
    onEndUpdate,
    ...props
  }) => {

    return (
      <WrappedComponent
        {...props}
        mutate={options=>{
          return Promise.resolve()
          .then(()=>onBeginUpdate(options.variables))
          .then(()=>new Promise(resolve => setTimeout(resolve, fakeLatencyMs)))
          .then(()=>mutate(options))
          .finally(onEndUpdate)
        }}
      />
    )

  }

  return EnhancedComponent

}


const withUpdating = WrappedComponent => props => {
  const [ updating, setUpdating ] = useState({})
  return (
    <WrappedComponent
      {...props}
      updating={updating}
      onBeginUpdate={setUpdating}
      onEndUpdate={()=>setUpdating({})}
    />
  )
}

const withProgressAdornment = WrappedComponent => ({ updating, ...props}) => {
  return (
    <WrappedComponent
      {...props}
      InputProps={{
        ...props.InputProps,
        ...(updating && {endAdornment: <InputAdornment position="end">
          <CircularProgress size={19} />
        </InputAdornment>}),
      }}
    />
  )
}

const withLoading = Loading => WrappedComponent => ({loading, ...props}) => {
  return loading && <Loading /> || <WrappedComponent {...props} />
}

const withChangeNotification = (SnackbarProps) => WrappedComponent => props => {

  const [ saveNotification, setSaveNotification ] = useState({ open: false })
  const noop = () => {}
  const onChange = ev => {
    return Promise
      .resolve((props.onChange || noop)(ev))
      .then(setSaveNotification({ open: true, key: Math.random() }))
  }

  return (
    <>
      <Snackbar
        autoHideDuration={1000}
        {...SnackbarProps}
        open={saveNotification.open}
        key={saveNotification.key}
        onClose={() => setSaveNotification({ open: false })}
      />
      <WrappedComponent {...props} onChange={onChange} />
    </>
  )
}

const AutoSaveTextField = compose(
  withChangeNotification({ message: <span>Saved</span> }),
  withProgressAdornment,
  withOnChangeDebounce({ debounceDelayMs: 500}),
  withProps({
    label: 'Text Field',
    margin: 'normal',
    fullWidth: true,
  }),
)(TextField)

export default compose(
  withApolloQuery(eventsQueryOptions),
  withApolloMutation(eventEditMutationOptions),
  withLoading(()=><div>Loading...</div>),
  withUpdating,
  withMutateProgress({ fakeLatencyMs: 1000 }),
)(EventDescription)
