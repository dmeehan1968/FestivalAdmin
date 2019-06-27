import React, { useState, useEffect, useMemo, useContext } from 'react'

// Styles
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

// Core
import SnackBar from '@material-ui/core/SnackBar'
import SnackBarContent from '@material-ui/core/SnackBarContent'

import Form from 'app/components/Form'
import Field from 'app/components/Field'
import FormResetSave from 'app/components/FormResetSave'

import Loading from 'app/components/Loading'

import useModelValidations from 'app/hooks/useModelValidations'
import useEventGet, { eventsQuery } from 'app/hooks/useEventGet'
import useEventEdit from 'app/hooks/useEventEdit'

import * as modelBuilders from 'server/database/models'

const useFormStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  }
}))

export const EventDescription = ({
  id
}) => {

  const classes = useFormStyles()
  const { models } = useModelValidations(modelBuilders)
  const [ success, setSuccess ] = useState(false)
  const [ networkError, setNetworkError ] = useState()

  const {
    loading,
    error,
    event,
  } = useEventGet(id)

  const eventEdit = useEventEdit()

  const handleSubmit = (values, actions) => {

    return eventEdit(values)

      .then(event => {
        actions.setValues(event)
      })

      .then(() => setSuccess(true))

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
              [err.path]: err.message,
            }
          }, {})

        actions.setErrors(attributeErrors)

        if (error.networkError) {
          setNetworkError(error.networkError.message)
        } else {
          setNetworkError()
        }

      })

      .finally(() => actions.setSubmitting(false))
  }

  const handleValidate = values => {
    return Object.keys(values).reduce((errors, key) => {
      try {
        const validator = models.event.attributes[key]
        if (validator) {
          validator(values[key])
        }
        return errors
      } catch (error) {
        return {
          ...errors,
          [key]: error.message
        }
      }
    }, {})
  }

  if (loading) {
    return <Loading />
  }

  return (
    <Form
      classes={classes}
      initialValues={event}
      enableReinitialize={true}
      onSubmit={handleSubmit}
      validate={handleValidate}
      saved={{
        message: success && 'Saved',
        clear: ()=>setSuccess(false)
      }}
      error={{
        message: networkError,
        clear: ()=>setNetworkError()
      }}
    >
      {({ dirty, isSubmitting, isValid }) => {
        return (
          <>
            <Field
              xs={12} sm={6}
              name="title"
              label="Title"
            />

            <Field
              xs={12} sm={6}
              name="subtitle"
              label="Subtitle"
            />

            <Field
              xs={12}
              name="description"
              label="Description"
              multiline
            />

            <Field
              xs={12}
              name="longDescription"
              label="Long Description"
              multiline
            />

            <FormResetSave classes={classes} canReset={dirty} canSubmit={!isSubmitting && isValid} />

          </>
        )
      }}
    </Form>
  )
}

export default EventDescription
