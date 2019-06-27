import React, { useState, useEffect, useMemo } from 'react'

// Styles
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

// Core
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
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
    event: {
      __typename: _,  // discard
      id: __,         // discard
      ...event
    },
  } = useEventGet(id)

  const { models } = useModelValidations(modelBuilders)
  const eventEdit = useEventEdit()

  if (loading) return <Loading />

  const handleSubmit = (event, { values, actions }) => {
    event.preventDefault()
    return eventEdit({ id, ...values })
      .then(data => console.log('data', data))
      .catch(error => {
        const attributeErrors = error.graphQLErrors
          .reduce((acc, err) => {
            return [
              ...acc,
              ...err.extensions.exception.errors,
            ]
          }, [])
          .reduce((acc, err) => {
            return {
              ...acc,
              [err.path]: [
                ...(acc[err.path] || []),
                err,
              ],
            }
          }, {})

        Object.keys(attributeErrors).forEach(key => {
          actions.clearFieldErrors(key)
          attributeErrors[key].forEach(error => actions.addFieldError(key, error.message))
        })
        console.log('attributeErrors', attributeErrors);
        console.log('networkError', error.networkError);
      })
  }

  const handleValidate = ({ values, touched, actions }) => {
    Object.keys(touched).forEach(key => {
      if (!touched[key]) {
        return
      }

      const validator = models.event.attributes[key]

      actions.clearFieldErrors(key)

      try {
        validator(values[key])
      } catch (error) {
        actions.addFieldError(key, error.message)
      }
    })
  }

  return (
    <Form
      className={classes.paper}
      initialValues={event}
      onSubmit={handleSubmit}
      onValidate={handleValidate}
    >
      {(props) => {
        return (
          <>
            <Field
              xs={12} md={6}
              label="Title"
              fullWidth
              {...props.title}
            />
            <Field
              xs={12} md={6}
              label="Sub Title"
              fullWidth
              {...props.subtitle}
            />
            <Field
              xs={12}
              label="Description"
              fullWidth
              multiline
              {...props.description}
            />
            <Field
              xs={12}
              label="Long Description"
              fullWidth
              multiline
              {...props.longDescription}
            />
          </>
        )
      }}
    </Form>
  )
}

const useFormStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  }
}))

export const Form = ({
  children,
  onReset,
  onSubmit = () => {},
  onValidate = () => ({}),
  initialValues = {},
  ...props
}) => {
  const classes = useFormStyles()
  const [ values, setValues ] = useState(initialValues)
  const [ touched, setTouched ] = useState({})
  const [ errors, setErrors ] = useState({})
  const [ isResetting, setIsResetting ] = useState(false)

  function isTouched() {
    return Object.keys(touched).length > 0
  }
  function isError() {
    return Object.keys(errors).length > 0
  }
  function isResetDisabled() {
    return !isTouched()
  }
  function isSubmitDisabled() {
    return !isTouched() || isError()
  }
  function setFieldValue(field, value, touched = true) {
    setValues(values => ({ ...values, [field]: value }))
  }
  function setFieldTouched(field, touched = true) {
    setTouched(touched => ({ ...touched, [field]: touched }))
  }
  function addFieldError(field, error) {
    setErrors(errors => ({
      ...errors,
      [field]: [
        ...errors[field] || [],
        ...(Array.isArray(error) && error || [ error ])
      ]
    }))
  }
  function clearFieldErrors(field) {
     setErrors(errors => {
       const { [field]: discard, ...newErrors } = errors
       return newErrors
     })
  }

  const actions = {
    setFieldValue,
    setFieldTouched,
    addFieldError,
    clearFieldErrors,
  }

  useEffect(() => {
    Promise.resolve(
      onValidate({
        values,
        touched: isResetting ? Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {}) : touched,
        actions,
      })
    )
    .finally(() => setIsResetting(() => false))

  }, [ values, touched, isResetting ])

  const childProps = useMemo(() => {
    return Object.keys(values).reduce((acc, key) => {
      return {
        ...acc,
        [key]: {
          value: values[key],
          error: !!errors[key],
          helperText: errors[key],
          onChange: event => {
            clearFieldErrors(key)
            setTouched({ ...touched, [key]: true })
            setValues({ ...values, [key]: event.target.value })
          },
        }
      }
    }, {})
  }, [ values, errors ])

  const resetForm = () => {
    setValues(() => initialValues)
    setTouched(() => ({}))
    setIsResetting(() => true)
  }

  return (
    <form onSubmit={ev=>onSubmit(ev, { values, actions })}>
      <Paper {...props}>
        <Grid container spacing={3}>
          {children(childProps)}
          <Grid item xs={12}>
            <Grid container justify="flex-end">
              <Grid item>
                <Button
                  className={classes.button}
                  variant="text"
                  color="default"
                  disabled={isResetDisabled()}
                  onClick={onReset || resetForm}
                >
                  Reset
                </Button>
                <Button
                  className={classes.button}
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitDisabled()}
                >
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

export const Field = ({
  xs, sm, md, lg, xl,
  value,
  onChange,
  ...props
}) => {
  return (
    <Grid item {...{ xs, sm, md, lg, xl }}>
      <TextField
        {...props}
        value={value}
        onChange={onChange}
      />
    </Grid>
  )
}

export default EventDescription
