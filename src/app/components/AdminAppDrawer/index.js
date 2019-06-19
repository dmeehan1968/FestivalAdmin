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
import PersonIcon from '@material-ui/icons/Person'
import EventIcon from '@material-ui/icons/Event'
import FormatQuoteIcon from '@material-ui/icons/FormatQuote'
import LabelIcon from '@material-ui/icons/Label'
import DirectionsIcon from '@material-ui/icons/Directions'
import PersonOutlineIcon from '@material-ui/icons/PersonOutline'
import ImageIcon from '@material-ui/icons/Image'
import ContactPhoneIcon from '@material-ui/icons/ContactPhone'
import NoteIcon from '@material-ui/icons/Note'
import AnnouncementIcon from '@material-ui/icons/Announcement'

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
      <List
        dense
        subheader={
          <ListSubheader>About You</ListSubheader>
        }
      >
        <Link component={RouterLink} to="/" color="inherit" underline="none">
          <ListItem button>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
        </Link>
        <Link component={RouterLink} to="/events" color="inherit" underline="none">
          <ListItem button>
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary="Events" />
          </ListItem>
        </Link>
      </List>
      <Divider />
      <List
        dense
        subheader={
          <ListSubheader>About the Event</ListSubheader>
        }
      >
        <Link component={RouterLink} to="/event/description" color="inherit" underline="none">
          <ListItem button>
            <ListItemIcon>
              <FormatQuoteIcon />
            </ListItemIcon>
            <ListItemText primary="Description" />
          </ListItem>
        </Link>
        <Link component={RouterLink} to="/event/tags" color="inherit" underline="none">
          <ListItem button>
            <ListItemIcon>
              <LabelIcon />
            </ListItemIcon>
            <ListItemText primary="Tags" />
          </ListItem>
        </Link>
        <Link component={RouterLink} to="/event/times" color="inherit" underline="none">
          <ListItem button>
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary="Opening Times" />
          </ListItem>
        </Link>
        <Link component={RouterLink} to="/event/venue" color="inherit" underline="none">
          <ListItem button>
            <ListItemIcon>
              <DirectionsIcon />
            </ListItemIcon>
            <ListItemText primary="Venue" />
          </ListItem>
        </Link>
        <Link component={RouterLink} to="/event/contact" color="inherit" underline="none">
          <ListItem button>
            <ListItemIcon>
              <PersonOutlineIcon />
            </ListItemIcon>
            <ListItemText primary="Contact" />
          </ListItem>
        </Link>
        <Link component={RouterLink} to="/event/images" color="inherit" underline="none">
          <ListItem button>
            <ListItemIcon>
              <ImageIcon />
            </ListItemIcon>
            <ListItemText primary="Images" />
          </ListItem>
        </Link>
        <Link component={RouterLink} to="/event/booking" color="inherit" underline="none">
          <ListItem button>
            <ListItemIcon>
              <ContactPhoneIcon />
            </ListItemIcon>
            <ListItemText primary="Booking Info" />
          </ListItem>
        </Link>
        <Link component={RouterLink} to="/event/info" color="inherit" underline="none">
          <ListItem button>
            <ListItemIcon>
              <AnnouncementIcon />
            </ListItemIcon>
            <ListItemText primary="Further Info" />
          </ListItem>
        </Link>
        <Link component={RouterLink} to="/event/notes" color="inherit" underline="none">
          <ListItem button>
            <ListItemIcon>
              <NoteIcon />
            </ListItemIcon>
            <ListItemText primary="Notes" />
          </ListItem>
        </Link>
        </List>
      <Divider />
    </Drawer>
  )
}

export default AdminAppDrawer
