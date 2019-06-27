import React, { useState, useEffect, useMemo, useContext } from 'react'

// Styles
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

// Core
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import SnackBar from '@material-ui/core/SnackBar'
import SnackBarContent from '@material-ui/core/SnackBarContent'
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
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  }
}))

const FormWrapper = ({
  onSubmit,
  status,
  actions,
  children,
  error,
}) => {
  const classes = useFormStyles()
  const [ showError, setShowError ] = useState(false)

  useEffect(()=>{
    setShowError(!!error)
  }, [ error ])

  return (
    <form onSubmit={onSubmit}>
      <Paper className={classes.paper}>
        <Grid container spacing={3}>
          <SnackBar
            open={showError}
            autoHideDuration={5000}
            onClose={()=>setShowError(false)}
          >
            <SnackBarContent
              className={classes.error}
              action={[
                <Button key="button" onClick={()=>setShowError(false)}>DISMISS</Button>
              ]}
              message={
                <span className={classes.message}>
                  {error && error.message}
                </span>
              }
            >
            </SnackBarContent>
          </SnackBar>

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
  touched,
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
  const [ formError, setFormError ] = useState()
  const [ submitted, setSubmitted ] = useState(false)

  if (loading) return <Loading />

  const handleSubmit = ({ values, actions }) => {

    return eventEdit({ id, ...values })
      .then(event => {
        Object.keys(event).forEach(key => {
          actions.setFieldValue(key, event[key], false)
        })
      })
      .then(() => setSubmitted(true))
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

        if (error.networkError) {
          setFormError(error.networkError)
        } else {
          setFormError()
        }
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
      componentProps={{ error: formError }}
      initialValues={event}
      onSubmit={handleSubmit}
      onValidate={handleValidate}
    >
      {({ status, actions }) => {
        return (
          <>
            <SnackBar
              open={submitted}
              onClose={()=>setSubmitted(false)}
              autoHideDuration={2000}
              message={<span>Saved</span>}
            />
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
  componentProps,
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
  const [ isSubmitting, setIsSubmitting ] = useState(false)

  function isTouched() {
    return Object.keys(touched).length > 0
  }
  function isError() {
    return Object.keys(errors).length > 0
  }
  function setFieldValue(field, value, touched = true) {
    setValues(values => ({ ...values, [field]: value }))
    setFieldTouched(field, touched)
  }
  function setFieldTouched(field, isTouched = true) {
    setTouched(touched => {
      if (!isTouched && touched[field]) {
        const { [field]: discard, ...newTouched } = touched
        return newTouched
      } else if (isTouched && !touched[field]) {
        return { ...touched, [field]: isTouched }
      }
      return touched
    })
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
    canSubmit: isTouched() && !isError() && !isSubmitting,
    isSubmitting,
  }

  const actions = {
    setFieldValue,
    setFieldTouched,
    addFieldError,
    clearFieldErrors,
    resetForm,
  }

  const handleSubmit = ev => {
    ev.preventDefault()
    return Promise.resolve(setIsSubmitting(true))
      .then(onSubmit({ values, status, actions }))
      .finally(setIsSubmitting(false))
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
        {...componentProps}
        {...props}
        onSubmit={handleSubmit}
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
  touched,
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
    actions.setFieldValue(key, ev.target.value, true)
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
