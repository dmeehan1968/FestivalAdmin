import React, { useState } from 'react'

// Styles
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

// Core
import AppBar from '@material-ui/core/AppBar'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

// Icons
import MenuIcon from '@material-ui/icons/Menu'

import { useAuthentication } from 'app/components/AuthenticationProvider'

import AuthDialog from 'app/components/AuthDialog'

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer+1,
  },
  toolbar: {
    paddingRight: 24,
  },
  menuIcon: {
    marginRight: theme.spacing(2),
  },
  menuButton: {
    marginRight: 36,
  },
  title: {
    flexGrow: 1,
  },
}))

export const AdminAppBar = ({
  isDrawerOpen = false,
  setIsDrawerOpen = () => {}
}) => {
  const classes = useStyles()
  const { user, isAuthenticated, login, logout, signup } = useAuthentication()
  const [ loginDialogOpen, setLoginDialogOpen ] = useState(false)

  return (
    <AppBar
      position="absolute"
      className={classes.appBar}
    >
      <Toolbar className={classes.toolbar}>
        <IconButton
          edge="start"
          className={classes.menuIcon}
          color="inherit"
          aria-label="Menu"
          onClick={()=>setIsDrawerOpen(!isDrawerOpen)}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
        <Typography component="h1" variant="h6" noWrap className={classes.title}>
          10 Parishes Festival
        </Typography>
        {user &&
          <Avatar src={user.avatar}>{user.initials}</Avatar>
        }
        {isAuthenticated
          && <Button color="inherit" onClick={logout}>Logout</Button>
          || <Button color="inherit" onClick={()=>setLoginDialogOpen(true)}>Login</Button>
        }
        <AuthDialog
          open={loginDialogOpen}
          login={(...args) => login(...args, { from: window.location.pathname })}
          signup={signup}
          onClose={()=>setLoginDialogOpen(false)}
        />

      </Toolbar>
    </AppBar>
  )
}

export default AdminAppBar
