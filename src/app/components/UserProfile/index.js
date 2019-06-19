import React from 'react'

// Styles
import { makeStyles } from '@material-ui/core/styles'

// Core
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
  }
}))
export const UserProfile = ({

}) => {
  const classes = useStyles()

  return (
    <Paper className={classes.paper}>
      User Profile
    </Paper>
  )
}

export default UserProfile
