import React, { useState, useEffect } from 'react'

import { graphql, compose } from 'react-apollo'
import { useQuery, useMutation } from 'react-apollo-hooks'
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
      contacts {
        id
        firstName
        lastName
      }
    }
  }
`

const eventEditMutation = gql`
  mutation eventEdit($event: EventInput!) {
    eventEdit(Event:$event) {
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

export const EventDescription = ({
  data,
  mutate,
  id,
  updating,
  ...otherProps
}) => {
  const { events: [ event = {} ] = [] } = data
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

  const mutateEventTitle = (id, title) => {
    return mutate({ variables: { event: { id, title }}})
  }

  return (
    <Grid container spacing={3} direction="column">
      <Grid item xs={12} md={6}>
        <Paper className={classes.paper}>
          <EventTitleField
            value={event.title}
            updating={isset(() => updating.event.title) }
            onChange={ev=>mutateEventTitle(id, ev.target.value)}
          />
        </Paper>
      </Grid>
    </Grid>
  )
}


const withProps = otherProps => WrappedComponent => props => {
  return (
    <WrappedComponent {...props} {...otherProps} />
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

const withOnChangeDebounce = ({ debounceDelayMs }) => WrappedComponent => props => {

  const [ value, setValue ] = useState(props.value || '')

  useEffect(() => {

    if (value === props.value) return

    console.log('debouncing', value, props.value);

    const timeout = setTimeout(() => {
      props.onChange && props.onChange({ target: { value }})
    }, debounceDelayMs)

    return () => clearTimeout(timeout)
  }, [ value ])

  return (
    <WrappedComponent
      {...props}
      onChange={ev=>setValue(ev.target.value)}
      value={value}
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

// const withDirty = WrappedComponent => props => {
//
//   const [ dirty, setDirty ] = useState(false)
//
//   useEffect(() => {
//     dirty && setDirty(false)
//   }, [ props.value ])
//
//   return (
//     <WrappedComponent
//       {...props}
//       dirty={dirty && 1 || undefined}
//       onChange={ev=>{
//         setDirty(true)
//         props.onChange && props.onChange(ev)
//       }}
//     />
//   )
// }

const withLoading = Loading => WrappedComponent => props => {
  return props.data.loading && <Loading /> || <WrappedComponent {...props} />
}

const EventTitleField = compose(
  withProgressAdornment,
  withOnChangeDebounce({ debounceDelayMs: 500}),
  withProps({
    label: 'Title',
    margin: 'normal',
    fullWidth: true,
  })
)(TextField)

export default compose(
  graphql(eventsQuery),
  graphql(eventEditMutation),
  withLoading(()=><div>Loading...</div>),
  withUpdating,
  withMutateProgress({ fakeLatencyMs: 0 }),
)(EventDescription)
