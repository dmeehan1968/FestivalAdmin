import React, { useState, useEffect, useMemo, useContext } from 'react'

// Styles
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

// Core
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'

import Loading from 'app/components/Loading'

import useModelValidations from 'app/hooks/useModelValidations'
import useEventGet from 'app/hooks/useEventGet'
import useEventEdit from 'app/hooks/useEventEdit'

import * as modelBuilders from 'server/database/models'

const useFormStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  }
}))

const FormWrapper = ({
  onSubmit,
  status,
  actions,
  children,
}) => {
  const classes = useFormStyles()
  return (
    <form onSubmit={onSubmit}>
      <Paper className={classes.paper}>
        <Grid container spacing={3}>
          {children}
          <Grid item xs={12}>
            <Grid container justify="flex-end">
              <Grid item>
                <Button
                  className={classes.button}
                  variant="text"
                  color="default"
                  disabled={!status.canReset}
                  onClick={actions.resetForm}
                >
                  Reset
                </Button>
                <Button
                  className={classes.button}
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!status.canSubmit}
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

export const FieldWrapper = ({
  xs, sm, md, lg, xl,
  error,
  ...props
}) => {
  return (
    <Grid item {...{ xs, sm, md, lg, xl }}>
      <TextField
        {...props}
        error={!!error}
        helperText={error}
      />
    </Grid>
  )
}

export const EventDescription = ({
  id,
}) => {

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

  const handleSubmit = (domEvent, { values, actions }) => {
    domEvent.preventDefault()
    return eventEdit({ id, ...values })
      .then(event => {
        Object.keys(event).forEach(key => {
          actions.setFieldValue(key, event[key])
        })
      })
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
      component={FormWrapper}
      initialValues={event}
      onSubmit={handleSubmit}
      onValidate={handleValidate}
    >
      {({ status, actions }) => {
        return (
          <>
            <Field
              component={FieldWrapper}
              xs={12} md={6}
              name="title"
              label="Title"
              fullWidth
            />
            <Field
              component={FieldWrapper}
              xs={12} md={6}
              name="subtitle"
              label="Sub Title"
              fullWidth
            />
            <Field
              component={FieldWrapper}
              xs={12}
              name="description"
              label="Description"
              fullWidth
              multiline
            />
            <Field
              component={FieldWrapper}
              xs={12}
              name="longDescription"
              label="Long Description"
              fullWidth
              multiline
            />
          </>
        )
      }}
    </Form>
  )
}

const FormDefault = ({
  children,
  status,
  actions,
  ...props,
}) => {
  return (
    <form {...props}>
      {children}
      <button disabled={!status.canReset} onClick={actions.resetForm}>Reset</button>
      <button type="submit" disabled={!status.canSubmit}>Submit</button>
    </form>
  )
}

const FormContext = React.createContext()

export const Form = ({
  component: FormComponent = FormDefault,
  children,
  onSubmit = () => {},
  onValidate = () => ({}),
  initialValues = {},
  ...props
}) => {
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

  const resetForm = () => {
    setValues(() => initialValues)
    setTouched(() => ({}))
    setIsResetting(() => true)
  }

  const status = {
    canReset: isTouched(),
    canSubmit: isTouched() && !isError(),
  }

  const actions = {
    setFieldValue,
    setFieldTouched,
    addFieldError,
    clearFieldErrors,
    resetForm,
  }

  return (
    <FormContext.Provider value={{
      values,
      touched,
      errors,
      status,
      actions,
    }}>
      <FormComponent
        {...props}
        onSubmit={ev=>onSubmit(ev, { values, actions })}
        status={status}
        actions={actions}
      >
        {children({ status, actions })}
      </FormComponent>
    </FormContext.Provider>
  )
}

const FieldDefault = ({
  label,
  ...props
}) => {
  return (
    <>
      {label && <label for={props.name}>{label || 'Field Label'}</label>}
      <input {...props} />
    </>
  )
}

export const Field = ({
  component: FieldComponent = FieldDefault,
  ...props
}) => {
  const {
    values,
    touched,
    errors,
    status,
    actions
  } = useContext(FormContext)

  const key = props.name || props.id

  const handleChange = ev => {
    actions.clearFieldErrors(key)
    actions.setFieldTouched(key, true)
    actions.setFieldValue(key, ev.target.value)
  }

  return (
    <FieldComponent
      value={values[key]}
      error={errors[key]}
      touched={touched[key]}
      onChange={handleChange}
      {...props}
    />
  )
}

export default EventDescription
