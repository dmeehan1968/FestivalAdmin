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
import { Formik, Form, Field } from 'formik'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}))

const FormField = ({
  xs, sm, md, lg, xl,
  ...props
}) => {
  return (
    <Field name={props.name}>
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
    </Field>
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
    <Grid container spacing={3} direction="column" alignItems="center">
      <Grid item xs={12} md={6}>
        <Formik
          initialValues={user}
          onSubmit={handleSubmit}
          validate={handleValidate}
        >
          {({ dirty, isSubmitting, isValid, resetForm }) => {
            return (
              <Form>
                <Paper className={classes.paper}>
                  <Grid container spacing={3}>
                    <FormField
                      xs={12} sm={6}
                      name="firstName"
                      label="First Name"
                    />
                    <FormField
                      xs={12} sm={6}
                      name="lastName"
                      label="Last Name"
                    />
                    <FormField
                      xs={12}
                      name="telephone"
                      label="Telephone"
                    />
                    <Grid item xs={12}>
                      <Grid container spacing={1} justify="flex-end">
                        <Grid item>
                          <Button
                            type="reset"
                            className={classes.button}
                            disabled={!dirty}
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
                            disabled={isSubmitting || !isValid}
                          >
                            Save
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </Form>
            )
          }}
        </Formik>
      </Grid>
    </Grid>
  )
}

export default UserProfile
