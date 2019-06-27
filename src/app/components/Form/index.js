import React, { useState, useEffect } from 'react'

// Core
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

// Formik
import { Formik, Form as FormikForm } from 'formik'

export const Form = ({
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

export default Form
