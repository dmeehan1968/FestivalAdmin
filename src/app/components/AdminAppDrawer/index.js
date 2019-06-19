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

const userLinks = [
  {
    text: "Profile",
    to: "/",
    icon: PersonIcon,
  },
  {
    text: "Events",
    to: "/events",
    icon: EventIcon,
  },
]

const eventLinks = [
  {
    text: "Description",
    to: "/event/description",
    icon: FormatQuoteIcon,
  },
  {
    text: "Tags",
    to: "/event/tags",
    icon: LabelIcon,
  },
  {
    text: "Opening Times",
    to: "/event/times",
    icon: EventIcon,
  },
  {
    text: "Venue",
    to: "/event/venue",
    icon: DirectionsIcon,
  },
  {
    text: "Contact",
    to: "/event/contact",
    icon: PersonOutlineIcon,
  },
  {
    text: "Images",
    to: "/event/images",
    icon: ImageIcon,
  },
  {
    text: "Booking Info",
    to: "/event/booking",
    icon: ContactPhoneIcon,
  },
  {
    text: "Further Info",
    to: "/event/info",
    icon: AnnouncementIcon,
  },
  {
    text: "Notes",
    to: "/event/notes",
    icon: NoteIcon,
  },
]

const renderLinks = links => {
  return links.map(({ text, to, icon: IconComponent }, key) => {
    return (
      <ListItem key={key} button component={RouterLink} to={to}>
        <ListItemIcon>
          <IconComponent />
        </ListItemIcon>
        <ListItemText primary={text} />
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
      <List
        dense
        subheader={
          <ListSubheader>About You</ListSubheader>
        }
      >
        {renderLinks(userLinks)}
      </List>
      <Divider />
      <List
        dense
        subheader={
          <ListSubheader>About the Event</ListSubheader>
        }
      >
        {renderLinks(eventLinks)}
      </List>
      <Divider />
    </Drawer>
  )
}

export default AdminAppDrawer
