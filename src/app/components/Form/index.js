import React from 'react'

// Core
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import SnackBar from '@material-ui/core/SnackBar'
import SnackBarContent from '@material-ui/core/SnackBarContent'

// Formik
import { Formik, Form as FormikForm } from 'formik'

export const Form = ({
  children,
  classes,
  saved = {},
  error = {},
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
          className={classes.error}
          message={error.message}
          action={[
            <Button key="button" onClick={error.clear}>Dismiss</Button>
          ]}
        />
      </SnackBar>
    </Grid>
  )
}

export default Form
