import React, { useState, useEffect } from 'react'
import faker from 'faker'
faker.locale = 'en_GB'

// Styles
import { makeStyles } from '@material-ui/core/styles'

// Core
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

// Formik
import { Formik, Form as FormikForm, Field as FormikField } from 'formik'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}))

const Form = ({
  children,
  classes,
  ...props,
}) => {
  return (
    <Grid container spacing={3} direction="column" alignItems="center">
      <Grid item xs={12} md={6}>
        <Formik {...props}>
          {args => {
            return (
              <FormikForm>
                <Paper className={classes.paper}>
                  <Grid container spacing={3}>
                    {children(args)}
                  </Grid>
                </Paper>
              </FormikForm>
            )
          }}
        </Formik>
      </Grid>
    </Grid>
  )
}


const Field = ({
  xs, sm, md, lg, xl,
  ...props
}) => {
  return (
    <FormikField name={props.name}>
      {({ field, form }) => {
        const key = field.name
        const error = form.touched[key] && form.errors[key]

        const handleChange = e => {
          e.persist()
          form.handleChange(e)
          form.setFieldTouched(key, true, false)
        }

        return (
          <Grid item {...{ xs, sm, md, lg, xl }}>
            <TextField
              {...field}
              {...props}
              onChange={handleChange}
              error={!!error}
              helperText={error}
              fullWidth
            />
          </Grid>
        )
      }}
    </FormikField>
  )
}

const ResetSave = ({
  classes,
  canReset,
  canSubmit,
}) => {
  return (
    <Grid item xs={12}>
      <Grid container spacing={1} justify="flex-end">
        <Grid item>
          <Button
            type="reset"
            className={classes.button}
            disabled={!canReset}
          >
            Reset
          </Button>
        </Grid>
        <Grid item>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
            disabled={!canSubmit}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export const UserProfile = ({
  initialUser = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    telephone: faker.phone.phoneNumber(),
  }
}) => {
  const classes = useStyles()
  const [ user, setUser ] = useState(initialUser)

  const handleSubmit = ( values, actions ) => {
    setUser(values)
    actions.setSubmitting(false)
  }

  const handleValidate = values => {
    const errors = {}
    if (values.firstName.length > 0) {
      errors.firstName = 'Too long'
    }
    return errors
  }

  useEffect(() => {
    console.log('user', user);
  }, [ user ])

  return (
    <Form
      classes={classes}
      initialValues={user}
      onSubmit={handleSubmit}
      validate={handleValidate}
    >
      {({ dirty, isSubmitting, isValid }) => {
        return (
          <>
            <Field
              xs={12} sm={6}
              name="firstName"
              label="First Name"
            />
            <Field
              xs={12} sm={6}
              name="lastName"
              label="Last Name"
            />
            <Field
              xs={12}
              name="telephone"
              label="Telephone"
            />
            <ResetSave classes={classes} canReset={dirty} canSubmit={!isSubmitting && isValid} />
          </>
        )
      }}
    </Form>
  )
}

export default UserProfile
