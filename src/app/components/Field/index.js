import React from 'react'

// Core
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'

// Formik
import { Formik, Form as FormikForm, Field as FormikField } from 'formik'

export const Field = ({
  xs, sm, md, lg, xl,
  ...props
}) => {
  return (
    <FormikField name={props.name} id={props.id}>
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
              margin="normal"
            />
          </Grid>
        )
      }}
    </FormikField>
  )
}

export default Field
