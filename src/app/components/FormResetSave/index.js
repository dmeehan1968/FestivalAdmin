import React, { useState, useEffect } from 'react'

// Core
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

export const FormResetSave = ({
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

export default FormResetSave
