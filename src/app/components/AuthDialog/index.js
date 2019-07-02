import React, { useState } from 'react'

import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'

import Auth from 'app/components/Auth'

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(4),
  },
}))

export const AuthDialog = ({
  login,
  signup,
  ...props
}) => {

  const classes = useStyles()

  const handleSubmit = (mode, { email, password, confirmPassword }) => {
    switch (mode) {
      case 'login':
        login(email, password)
        break;
      case 'signup':
        signup(email, password, confirmPassword)
        break;
    }
    props.onClose()
  }

  return (
    <Dialog {...props} maxWidth="xs" PaperProps={{ className: classes.container}}>
      <Auth onSubmit={handleSubmit} />
    </Dialog>
  )
}

export default AuthDialog
