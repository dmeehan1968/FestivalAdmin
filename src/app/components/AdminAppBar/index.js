import React from 'react'

// Styles
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

// Core
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

// Icons
import MenuIcon from '@material-ui/icons/Menu'

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
        <Button color="inherit">
          Login
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default AdminAppBar
