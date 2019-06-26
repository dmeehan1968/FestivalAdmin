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
import Typography from '@material-ui/core/Typography'

import ValidatedTextField from 'app/components/ValidatedTextField'

import useModelValidations from 'app/hooks/useModelValidations'

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
