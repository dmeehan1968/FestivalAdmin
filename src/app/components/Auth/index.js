import React, { useState, useMemo } from 'react'

import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import PersonIcon from '@material-ui/icons/Person'

import Form from 'app/components/Form'
import Field from 'app/components/Field'

import * as yup from 'yup'

const useStyles = makeStyles(theme => ({
  form: {
    '& .MuiPaper-root': {
      padding: theme.spacing(0, 6, 4, 6),
    }
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

const useToggleButtonGroupStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexFlow: 'row nowrap',
    alignItems: 'flex-start',
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
  },
  button: {
    width: '100%',
    borderRadius: 0,
    boxShadow: 'none',
    '&:first-child': {
      borderRadius: `${theme.shape.borderRadius}px 0 0 ${theme.shape.borderRadius}px`,
    },
    '&:last-child': {
      borderRadius: `0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0`,
    },
  },
  small: {
    fontSize: '0.75rem',
  },
  medium: {
    // fontSize: '1rem',
  },
  large: {
    fontSize: '1.25rem',
  },
  selected: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
    }
  },
}))

const ToggleButtonGroup = ({
  children,
  variant,
  exclusive = true,
  value,
  onChange = () => {},
  size = 'medium',
  ...props
}) => {
  const classes = useToggleButtonGroupStyles()
  return (
    <div {...props} className={clsx(classes.container, props.className)}>
      {
        React.Children.map(children, child => {
          return React.cloneElement(child, {
            variant,
            className: clsx(
              classes.button,
              classes[size],
              child.props.className,
              child.props.value === value ? classes.selected : null
            ),
            onClick: ev=>onChange(ev, child.props.value),
          })
        })
      }
    </div>
  )
}

const ToggleButton = ({
  ...props
}) => {
  return (
    <Button {...props} />
  )
}

export const Auth = ({

}) => {

  const classes = useStyles()
  const [ mode, setMode ] = useState('login')
  const [ credentials, setCredentials ] = useState({ email: '', password: '', confirmPassword: '' })
  const loginSchema = useMemo(() => {
    return yup.object().shape({
      email: yup.string().email().required(),
      password: yup
        .string()
        .required()
        .min(8)
        .matches(/[a-z]+/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]+/, 'Password must contain at least one uppercase letter')
        .matches(/[A-Z]+/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]+/, 'Password must contain at least one number')
        .matches(/\W+/, 'Password must contain at least one non-word character')
    })
  })
  const signupSchema = loginSchema.shape({
    confirmPassword: yup
      .reach(loginSchema, 'password')
      .oneOf([yup.ref('password')], 'Passwords must match')
  })

  const handleModeChange = (ev, mode) => {
    console.log(mode);
    setMode(mode)
  }

  const handleSubmit = values => {
    console.log('submit', values)
    setCredentials(values)
  }

  return (
    <Form
      className={classes.form}
      initialValues={credentials}
      validationSchema={mode === 'login' ? loginSchema : signupSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid }) => (
        <>
          <Grid container className={classes.message} direction="column" justify="flex-start" alignItems="stretch">
            <Typography variant="h6" align="center">
              <PersonIcon className={classes.icon} />
            </Typography>
          </Grid>
          <ToggleButtonGroup
            className={classes.toggleButtonGroup}
            variant="contained"
            value={mode}
            exclusive
            onChange={handleModeChange}
          >
            <ToggleButton
              value="login"
            >
              Login
            </ToggleButton>
            <ToggleButton
              value="signup"
            >
              Signup
            </ToggleButton>
          </ToggleButtonGroup>
          <Grid container className={classes.message} direction="column" justify="flex-start" alignItems="stretch">
            <Typography variant="h6" align="center">
              {mode === 'login' && 'Welcome Back!' || 'Hola!'}
            </Typography>
            <Typography variant="body1" align="center">
              {mode === 'login' &&
                  "Pop your credentials in those little boxes and lets get down to business."
              }
              {mode === 'signup' &&
                  "It's a pleasure to make your aquaintance.  How would you like us to remember you?"
              }
            </Typography>
          </Grid>
          <Field
            xs={12}
            name="email"
            type="email"
            label="Email Address"
            margin="normal"
          />
          <Field
            xs={12}
            name="password"
            type="password"
            label="Password"
            margin="normal"
          />
          {mode === 'signup' &&
            <Field
              xs={12}
              name="confirmPassword"
              type="password"
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
            disabled={!isValid}
          >
            {mode === 'login' && 'Login' || 'Signup'}
          </Button>
        </>
      )}
    </Form>
  )
}

export default Auth
