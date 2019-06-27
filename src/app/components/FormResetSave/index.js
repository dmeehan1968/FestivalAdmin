import React from 'react'

// Styles
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

// Core
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
}))

export const FormResetSave = ({
  canReset,
  canSubmit,
}) => {

  const classes = useStyles()

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

export default FormResetSave
