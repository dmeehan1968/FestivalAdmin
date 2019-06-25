import React, { useState, useEffect, useMemo } from 'react'

import { Query } from 'react-apollo'
import { useQuery } from 'react-apollo-hooks'
import { branch, compose, mapProps, renderComponent, withProps } from 'recompose'

import { gql } from 'apollo-boost'

// Styles
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

// Core
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { default as MuiTextField } from '@material-ui/core/TextField'
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

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
  },
}))

const eventsQuery = gql`
  query findOneEvent($id: Int!) {
  	events: eventGet(id: $id, limit: 1) {
      title
      subtitle
      description
      longDescription
    }
  }
`

const useEventGet = id => {

  const {
    data: {
      events: [
        event = {}
      ] = []
    } = {},
    ...rest
  } = useQuery(eventsQuery, { variables: { id }})

  return { event, ...rest }

}

import eventModel from 'server/database/models/event'

const notEmpty = (value, args) => {
  return !(!value || value.length < 1)
}
notEmpty.message = '${column} should not be empty'

const len = (value, args) => {
  const [ min, max ] = args
  if (value.length < min) {
    throw new Error(`\${column} must have length greater than or equal to ${min} characters, got ${value.length}`)
  }
  if (value.length > max) {
    throw new Error(`\${column} must have length less than or equal to ${max} characters, got ${value.length}`)
  }
  return true
}

const knownValidations = {
  notEmpty,
  len,
}

const useModelValidations = () => {

  return useMemo(() => {

    const sequelize = {
      define(model, attributes, options) {
        return {
          columns: Object.keys(attributes).reduce((acc, column) => {
            return {
              ...acc,
              [column]: value => {
                Object.keys(attributes[column].validate || {}).forEach(key => {
                  let props = attributes[column].validate[key]
                  let func
                  let args
                  let msg
                  if (typeof props === 'function') {
                    func = props
                    props = undefined
                  } else {
                    if (knownValidations[key] !== undefined) {
                      func = knownValidations[key]
                      if (typeof props === 'object' && !Array.isArray(props)) {
                        msg = props.msg
                        args = props.args
                      } else {
                        args = props
                      }
                    } else {
                      throw new Error(`Unknown validation '${key}'`)
                    }
                  }

                  try {
                    if (!func) {
                      throw new Error(`Validation Error: invalid validator specified for ${column}`)
                    }
                    if (!func(value, args)) {
                      throw new Error(msg || func.message || '${column} fails validation ${key}, got \'${value}\'')
                    }
                  } catch (error) {
                    throw new Error(
                      (msg || error.message)
                      .replace('${column}', column)
                      .replace('${key}', key)
                      .replace('${value}',JSON.stringify(value))
                    )
                  }
                })
              }
            }
          }, {}),
          validate: options.validate || {}
        }
      }
    }
    const STRING = () => ({})
    const INTEGER = () => ({})

    const DataTypes = {
      STRING,
      INTEGER,
    }

    const { columns, validate } = eventModel(sequelize, DataTypes)
    return {
      event: { columns, validate }
    }

  })

}

const useValidation = (validations, wrappedOnChange) => {

  const [ helperText, setHelperText ] = useState()

  const onChange = ev => {
    const noop = () => {}
    try {
      (validations || noop)(ev.target.value)
      helperText && setHelperText(undefined)
    } catch(error) {
      setHelperText(error.message)
    }
    return (wrappedOnChange || noop)(ev)
  }

  return {
    onChange,
    helperText,
    error: !!helperText,
  }
}

const TextField = ({ validations, ...props }) => {

  const validationProps = useValidation(validations, props.onChange)

  return (
    <MuiTextField {...props} {...validationProps} />
  )
}

export const EventDescription = ({
  id,
}) => {

  const classes = useStyles()
  const {
    loading,
    error,
    event: {
      title,
      subtitle,
      description,
      longDescription
    }
  } = useEventGet(id)

  const validations = useModelValidations()

  if (loading) return <Loading />

  return (
    <Paper className={classes.paper}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Title"
            defaultValue={title}
            validations={validations.event.columns.title}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Sub Title"
            defaultValue={subtitle}
            validations={validations.event.columns.subtitle}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description"
            defaultValue={description}
            validations={validations.event.columns.description}
            fullWidth
            multiline
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Long Description"
            defaultValue={longDescription}
            validations={validations.event.columns.longDescription}
            fullWidth
            multiline
          />
        </Grid>
      </Grid>
    </Paper>
  )
}

///////////////////////////////////////////////
///////////////////////////////////////////////

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
  // withStyles(styles),
  // withProps(({ id }) => ({ variables: { id }})),
  // withQuery({ query: eventsQuery }),
  // branch(props => props.loading, renderComponent(Loading)),
  // branch(props => isset(() => props.error.networkError), renderComponent(withProps({ title: "Load Failure" })(NetworkError))),
  // mapProps(({ data: { events: [ event = {} ] = [] } = {}, ...props }) => ({
  //   ...props,
  //   ...event,
  // })),
)(EventDescription)
