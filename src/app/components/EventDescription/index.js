import React, { useState, useEffect, useMemo } from 'react'

// Styles
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

// Core
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import ValidatedTextField from 'app/components/ValidatedTextField'
import Loading from 'app/components/Loading'

import useModelValidations from 'app/hooks/useModelValidations'
import useEventGet from 'app/hooks/useEventGet'

import * as modelBuilders from 'server/database/models'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
  },
}))

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
    <Form className={classes.paper}>
      <FormField
        xs={12} md={6}
        label="Title"
        defaultValue={title}
        validations={models.event.attributes.title}
        fullWidth
      />
      <FormField
        xs={12} md={6}
        label="Sub Title"
        defaultValue={subtitle}
        validations={models.event.attributes.subtitle}
        fullWidth
      />
      <FormField
        xs={12}
        label="Description"
        defaultValue={description}
        validations={models.event.attributes.description}
        fullWidth
        multiline
      />
      <FormField
        xs={12}
        label="Long Description"
        defaultValue={longDescription}
        validations={models.event.attributes.longDescription}
        fullWidth
        multiline
      />
    </Form>
  )
}

export const Form = ({ children, ...props }) => {
  return (
    <Paper {...props}>
      <Grid container spacing={3}>
        {children}
      </Grid>
    </Paper>
  )
}

export const FormField = ({ xs, sm, md, lg, xl, ...props}) => {
  return (
    <Grid item {...{ xs, sm, md, lg, xl }}>
      <ValidatedTextField {...props} />
    </Grid>
  )
}

export default EventDescription
