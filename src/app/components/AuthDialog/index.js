import React, { useState } from 'react'

import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Grid from '@material-ui/core/Grid'
import SnackBar from '@material-ui/core/SnackBar'
import SnackBarContent from '@material-ui/core/SnackBarContent'

import Auth from 'app/components/Auth'

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(4),
  },
  success: {
    backgroundColor: 'green',
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  }
}))

export const AuthDialog = ({
  login,
  signup,
  ...props
}) => {

  const classes = useStyles()
  const [ snackbarProps, setSnackbarProps ] = useState({})
  const [ isSubmitting, setIsSubmitting ] = useState(false)

  const handleSubmit = (mode, { email, password, confirmPassword }) => {
    const authenticate = mode === 'login'
      ?
        () => login(email, password)
      :
        () => signup(email, password, confirmPassword)

    return Promise.resolve()
    .then(() => setIsSubmitting(true))
    .then(() => authenticate())
    .then(() => {
      return new Promise(resolve => {
        setSnackbarProps({
          snackBar: {
            open: true,
            autoHideDuration: 1500,
            onClose: () => {
              setSnackbarProps({})
              props.onClose()
              resolve()
            },
          },
          snackBarContent: {
            message: 'Login Successful',
            className: classes.success,
            action: [],
          },
        })
      })
    })
    .catch(error => {
      return new Promise(resolve => {
        setSnackbarProps({
          snackBar: {
            open: true,
            autoHideDuration: 5000,
            onClose: () => {
              setSnackbarProps({})
              resolve()
            },
          },
          snackBarContent: {
            message: `Login Failed: ${error.message}`,
            className: classes.error,
            action: [
              <Button key="button" color="inherit" onClick={()=>setSnackbarProps({})}>Dismiss</Button>
            ],
          },
        })
      })
    })
    .finally(() => setIsSubmitting(false))
  }

  return (
    <Dialog {...props} maxWidth="xs" PaperProps={{ className: classes.container}}>
      <Auth onSubmit={handleSubmit} canSubmit={!isSubmitting} />
      <SnackBar {...snackbarProps.snackBar}>
        <SnackBarContent {...snackbarProps.snackBarContent} />
      </SnackBar>
    </Dialog>
  )
}

export default AuthDialog
