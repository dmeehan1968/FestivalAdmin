import React, { useState, useEffect } from 'react'

import { Query } from 'react-apollo'
import { branch, compose, mapProps, renderComponent, withProps } from 'recompose'

import { gql } from 'apollo-boost'

// Styles
import clsx from 'clsx'
import { withStyles } from '@material-ui/core/styles'

// Core
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

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
  classes = {},
  title,
  subtitle,
  description,
  longDescription,
}) => {

  return (
    <Paper className={classes.paper}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Title"
            defaultValue={title}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Sub Title"
            defaultValue={subtitle}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description"
            defaultValue={description}
            fullWidth
            multiline
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Long Description"
            defaultValue={longDescription}
            fullWidth
            multiline
          />
        </Grid>
      </Grid>
    </Paper>
  )
}

///////////////////////////////////////////////

const eventsQuery = gql`
  query findOneEvent($id: Int!) {
  	events: eventGet(id: $id, limit: 1) {
      id
      title
      subtitle
      description
      longDescription
    }
  }
`

///////////////////////////////////////////////

const styles = theme => ({
  paper: {
    padding: theme.spacing(2),
  },
})

const withQuery = QueryProps => WrappedComponent => ({ variables, ...props }) => {
  return (
    <Query {...QueryProps} variables={variables}>
      {({ loading, error, data, ...queryResult}) => (
        <WrappedComponent {...props} {...{loading, error, data}} {...queryResult} />
      )}
    </Query>
  )
}

const Loading = () => <div>Loading...</div>

const NetworkError = ({
  title,
  error,
  classes = {}
}) => {
  return (
    <Paper className={classes.paper}>
      <Grid item xs={12}>
        <Typography variant="h6">
          {title || 'Error'}
        </Typography>
        <Typography variant="body1">
          {error.message}
        </Typography>
      </Grid>
    </Paper>
  )
}

export default compose(
  withStyles(styles),
  withProps(({ id }) => ({ variables: { id }})),
  withQuery({ query: eventsQuery }),
  branch(props => props.loading, renderComponent(Loading)),
  branch(props => isset(() => props.error.networkError), renderComponent(withProps({ title: "Load Failure" })(NetworkError))),
  mapProps(({ data: { events: [ event = {} ] = [] } = {}, ...props }) => ({
    ...props,
    ...event,
  })),
)(EventDescription)
