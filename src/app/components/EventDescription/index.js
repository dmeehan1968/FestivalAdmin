import React, { useState, useEffect } from 'react'

import { Query, Mutation, graphql, compose } from 'react-apollo'
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
import Snackbar from '@material-ui/core/Snackbar'

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
      subtitle
      contacts {
        id
        firstName
        lastName
      }
    }
  }
`

const mapResultToProps = ({
  loading,
  error,
  data: {
    events: [ event ] = []
  } = {}
}) => ({ event, loading, error })

const mapPropsToVariables = ({ id }) => ({ id })

const withApolloQuery = (query, mapResultToProps, mapPropsToVariables) => WrappedComponent => props => {
  const noop = () => ({})
  const variables = (mapPropsToVariables || noop)(props)
  return (
    <Query query={query} variables={variables}>
      {result => {
        return (
          <WrappedComponent
            {...props}
            {...(mapResultToProps || noop)(result)}
          />
        )
      }}
    </Query>
  )
}

const mapMutateToProps = mutate => ({
  eventEdit: event => mutate({ variables: { event }}),
})

const mapMutationResultToProps = ({ called, loading, error, data: { eventEdit: event = {} } = {} }) => {
  if (called && !loading && !error) {
    return { event }
  }
}

const withApolloMutate = (mutation, mapMutateToProps, mapMutationResultToProps) => WrappedComponent => props => {
  const noop = () => ({})
  return (
    <Mutation mutation={mutation}>
      {(mutate, result) => {
        console.log('result', result);
        return (
          <WrappedComponent
            {...props}
            {...(mapMutateToProps || noop)(mutate)}
            // {...(mapMutationResultToProps || noop)(result)}
          />
        )
      }}
    </Mutation>
  )
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


const withProps = injectedProps => WrappedComponent => props => {
  return (
    <WrappedComponent
      {...injectedProps}
      {...props}
    />
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

const withLoading = Loading => WrappedComponent => ({loading, ...props}) => {
  return loading && <Loading /> || <WrappedComponent {...props} />
}

const withChangeNotification = (SnackbarProps) => WrappedComponent => props => {

  const [ saveNotification, setSaveNotification ] = useState({ open: false })
  const noop = () => {}
  const onChange = ev => {
    console.log('onChange', ev);
    return Promise.resolve((props.onChange || noop)(ev)).then(setSaveNotification({ open: true, key: Math.random() }))
  }

  return (
    <>
      <Snackbar
        autoHideDuration={1000}
        {...SnackbarProps}
        open={saveNotification.open}
        key={saveNotification.key}
        onClose={() => setSaveNotification(false)}
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
  // graphql(eventsQuery),
  withApolloQuery(eventsQuery, mapResultToProps, mapPropsToVariables),
  // graphql(eventEditMutation),
  withApolloMutate(eventEditMutation, mapMutateToProps, mapMutationResultToProps),
  withLoading(()=><div>Loading...</div>),
  withUpdating,
  withMutateProgress({ fakeLatencyMs: 1000 }),
)(EventDescription)
