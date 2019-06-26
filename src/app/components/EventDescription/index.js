import React, { useState, useEffect, useMemo } from 'react'

// Styles
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

// Core
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import ValidatedTextField from 'app/components/ValidatedTextField'
import Loading from 'app/components/Loading'

import useModelValidations from 'app/hooks/useModelValidations'
import useEventGet from 'app/hooks/useEventGet'
import useEventEdit from 'app/hooks/useEventEdit'

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
    event: originalEvent,
  } = useEventGet(id)

  const { models } = useModelValidations(modelBuilders)
  const eventEdit = useEventEdit()
  const [ event, setEvent ] = useState(originalEvent)

  useEffect(() => {
    setEvent(originalEvent)
  }, [ loading ])

  if (loading) return <Loading />

  const handleSubmit = ev => {
    ev.preventDefault()
    eventEdit(event)
    .then(data => console.log('data', data))
    .catch(error => console.log('error', error.graphQLErrors))
  }

  return (
    <Form className={classes.paper} onSubmit={handleSubmit}>
      <FormField
        xs={12} md={6}
        label="Title"
        value={event.title}
        validations={models.event.attributes.title}
        onChange={ev=>setEvent({...event, title: ev.target.value })}
        fullWidth
      />
      <FormField
        xs={12} md={6}
        label="Sub Title"
        value={event.subtitle}
        validations={models.event.attributes.subtitle}
        fullWidth
      />
      <FormField
        xs={12}
        label="Description"
        value={event.description}
        validations={models.event.attributes.description}
        fullWidth
        multiline
      />
      <FormField
        xs={12}
        label="Long Description"
        value={event.longDescription}
        validations={models.event.attributes.longDescription}
        fullWidth
        multiline
      />
    </Form>
  )
}

const useFormStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  }
}))

export const Form = ({ children, onSubmit, ...props }) => {
  const classes = useFormStyles()
  return (
    <form onSubmit={onSubmit}>
      <Paper {...props}>
        <Grid container spacing={3}>
          {children}
          <Grid item xs={12}>
            <Grid container justify="flex-end">
              <Grid item>
                <Button className={classes.button} variant="text" color="default" disabled>
                  Reset
                </Button>
                <Button className={classes.button} type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </form>
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
