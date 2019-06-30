import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

// Styles
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

// Core
import Collapse from '@material-ui/core/Collapse'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import Link from '@material-ui/core/Link'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'

// Icons
import EventIcon from '@material-ui/icons/Event'

import routes from 'app/routes'

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
  },
  appBarSpacer: theme.mixins.toolbar,
  nested: {
    paddingLeft: theme.spacing(4),
  },
}))

const renderLinks = links => {
  return links
  .map(({ title, path, icon: IconComponent, link: LinkComponent = RouterLink }, key) => {
    return (
      <ListItem
        key={key}
        button
        component={LinkComponent}
        to={path}
      >
        <ListItemIcon>
          <IconComponent />
        </ListItemIcon>
        <ListItemText primary={title} />
      </ListItem>
    )
  })
}

export const AdminAppDrawer = ({
  isDrawerOpen = false,
}) => {
  const classes = useStyles()
  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: clsx(classes.drawerPaper, !isDrawerOpen && classes.drawerPaperClose)
      }}
      open={isDrawerOpen}
    >
      <div className={classes.appBarSpacer} />
      <List>
        <ListItem button>
          <ListItemIcon>
            <EventIcon />
          </ListItemIcon>
          <ListItemText primary="Event Title" />
        </ListItem>
      </List>
      <Divider />
      <List dense>
        {renderLinks(routes)}
      </List>
      <Divider />
    </Drawer>
  )
}

export default AdminAppDrawer
