import React from 'react'
import { Link } from 'react-router-dom'

// Icons
import HomeIcon from '@material-ui/icons/Home'
import EventNoteIcon from '@material-ui/icons/EventNote'
import LockOpenIcon from '@material-ui/icons/LockOpen'

import withForwardRef from 'app/hocs/withForwardRef'
import withAuthentication from 'app/hocs/withAuthentication'
import withAuthorization from 'app/hocs/withAuthorization'

import EventsGrid from 'app/components/EventsGrid'
import NotAuthorized from 'app/components/NotAuthorized'
import NotAuthenticated from 'app/components/NotAuthenticated'
import HomePage from 'app/components/HomePage'
import PermissionsPage from 'app/components/PermissionsPage'

export const eventRoutes = [
  {
    title: 'Home',
    path: '/',
    icon: HomeIcon,
    component: HomePage,
  },
  {
    title: 'Events',
    path: '/events',
    icon: EventNoteIcon,
    component: withAuthentication(NotAuthenticated)(EventsGrid),
    link: withForwardRef(withAuthentication()(Link)),
  },
]

export const adminRoutes = [
  {
    title: 'Permissions',
    path: '/permissions',
    icon: LockOpenIcon,
    component: withAuthorization([], ['AuthPermissionRead'], NotAuthorized)(PermissionsPage),
    link: withForwardRef(withAuthorization([],['AuthPermissionRead'])(Link)),
  },
]
