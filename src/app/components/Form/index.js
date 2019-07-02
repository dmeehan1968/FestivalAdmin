import React from 'react'

// Styles
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

// Core
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import SnackBar from '@material-ui/core/SnackBar'
import SnackBarContent from '@material-ui/core/SnackBarContent'

// Formik
import { Formik, Form as FormikForm } from 'formik'

const useStyles = makeStyles(theme => ({
  container: {

  },
  paper: {
    padding: theme.spacing(2),
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  }
}))

export const Form = ({
  children,
  saved = {},
  error = {},
  ...props,
}) => {
  const classes = useStyles()

  return (
    <>
      <Formik {...props}>
        {args => {
          return (
            <FormikForm>
              {children(args)}
            </FormikForm>
          )
        }}
      </Formik>
      <SnackBar
        open={!!saved.message}
        autoHideDuration={1000}
        message={saved.message}
        onClose={saved.clear}
      />
      <SnackBar
        open={!!error.message}
        autoHideDuration={5000}
        onClose={error.clear}
      >
        <SnackBarContent
          className={clsx(classes.error, classes.message)}
          message={error.message}
          action={[
            <Button key="button" onClick={error.clear}>Dismiss</Button>
          ]}
        />
      </SnackBar>
    </>
  )
}

export default Form
