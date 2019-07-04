import React, { useState } from 'react'

import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import Typography from '@material-ui/core/Typography'

import PersonIcon from '@material-ui/icons/Person'

import { Formik, Form } from 'formik'

// import Form from 'app/components/Form'
import Field from 'app/components/Field'
import { ToggleButtonGroup, ToggleButton } from './ToggleButton'
import PasswordField from './PasswordField'

import useLoginSchema from './useLoginSchema'
import useSignupSchema from './useSignupSchema'
import useAuthMode from './useAuthMode'

const useAuthStyles = makeStyles(theme => ({
  form: {
    '& .MuiPaper-root': {
      [theme.breakpoints.up('md')]: {
        padding: theme.spacing(0, 6, 4, 6),
      },
    },
  },
  button: {
    margin: theme.spacing(2, 0, 0, 0),
  },
  toggleButtonGroup: {
    width: '100%',
  },
  toggleButton: {
    width: '100%',
  },
  message: {
    width: '100%',
    padding: theme.spacing(1),
  },
  icon: {
    fontSize: '8rem',
    color: theme.palette.grey['400'],
  }
}))

export const Auth = ({
  credentials = {
    email: '',
    password: '',
    confirmPassword: ''
  },
  onSubmit=(mode, credentials) => console.log('submit', mode, credentials),
  canSubmit,
}) => {

  const classes = useAuthStyles()
  const { setAuthMode, isLogin, isSignup } = useAuthMode()
  const loginSchema = useLoginSchema()
  const signupSchema = useSignupSchema()

  const handleSubmit = values => {
    onSubmit(isLogin() ? 'login' : 'signup', values)
  }

  return (
    <Formik
      className={classes.form}
      initialValues={credentials}
      validationSchema={isLogin() ? loginSchema : signupSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid }) => (
        <Form>
          <Grid container className={classes.message} direction="column" justify="flex-start" alignItems="stretch">
            <Typography variant="h6" align="center">
              <PersonIcon className={classes.icon} />
            </Typography>
          </Grid>
          <ToggleButtonGroup
            className={classes.toggleButtonGroup}
            variant="contained"
            value={isLogin() ? 'login' : 'signup'}
            exclusive
            onChange={(ev, mode) => setAuthMode(mode)}
          >
            <ToggleButton
              value="login"
              disabled={!canSubmit}
            >
              Login
            </ToggleButton>
            <ToggleButton
              value="signup"
              disabled={!canSubmit}
            >
              Signup
            </ToggleButton>
          </ToggleButtonGroup>
          <Grid container className={classes.message} direction="column" justify="flex-start" alignItems="stretch">
            <Typography variant="h6" align="center">
              {isLogin() && 'Welcome Back!' || 'Hola!'}
            </Typography>
            <Typography variant="body1" align="center">
              {isLogin() &&
                "Pop your credentials in those little boxes and lets get down to business."
              }
              {isSignup() &&
                "It's a pleasure to make your aquaintance.  How would you like us to remember you?"
              }
            </Typography>
          </Grid>
          <Field
            xs={12}
            name="email"
            type="email"
            label="Email Address"
            autoFocus
          />
          <PasswordField
            xs={12}
            name="password"
            label="Password"
          />
          {isSignup() &&
            <PasswordField
              xs={12}
              name="confirmPassword"
              label="Confirm Password"
              margin="normal"
            />
          }
          <Button
            type="submit"
            className={classes.button}
            variant="contained"
            color="primary"
            fullWidth
            disabled={!isValid || !canSubmit}
          >
            {isLogin() && 'Login' || 'Signup'}
          </Button>
        </Form>
      )}
    </Formik>
  )
}

export default Auth
