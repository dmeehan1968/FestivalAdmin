import React, { useState, useEffect, useMemo } from 'react'

import { Query } from 'react-apollo'
import { useQuery } from 'react-apollo-hooks'

import { gql } from 'apollo-boost'

// Styles
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

// Core
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import ModelValidationParser from 'app/utils/ModelValidationParser'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
  },
}))

const eventsQuery = gql`
  query eventGet($id: Int!) {
  	events: eventGet(id: $id, limit: 1) {
      title
      subtitle
      description
      longDescription
    }
  }
`

const Loading = () => (<div>Loading...</div>)

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

import * as modelBuilders from 'server/database/models'

const useModelValidations = builders => {

  return useMemo(() => {

    const parser = new ModelValidationParser()

    Object.keys(builders).forEach(builderKey => {
      const builder = builders[builderKey]
      const model = builder(parser, ModelValidationParser.DataTypes)
    })

    return parser
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

const ValidatedTextField = ({ validations, ...props }) => {

  const validationProps = useValidation(validations, props.onChange)

  return (
    <TextField {...props} {...validationProps} />
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

  const { models } = useModelValidations(modelBuilders)

  if (loading) return <Loading />

  return (
    <Paper className={classes.paper}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ValidatedTextField
            label="Title"
            defaultValue={title}
            validations={models.event.attributes.title}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ValidatedTextField
            label="Sub Title"
            defaultValue={subtitle}
            validations={models.event.attributes.subtitle}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <ValidatedTextField
            label="Description"
            defaultValue={description}
            validations={models.event.attributes.description}
            fullWidth
            multiline
          />
        </Grid>
        <Grid item xs={12}>
          <ValidatedTextField
            label="Long Description"
            defaultValue={longDescription}
            validations={models.event.attributes.longDescription}
            fullWidth
            multiline
          />
        </Grid>
      </Grid>
    </Paper>
  )
}

export default EventDescription
