import React, { useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'

// Icons
import HomeIcon from '@material-ui/icons/Home'
import PersonIcon from '@material-ui/icons/Person'

import { useAuthentication } from 'app/components/AuthenticationProvider'
import useRedirect from 'app/hooks/useRedirect'
import withForwardRef from 'app/hocs/withForwardRef'
import withAuthentication from 'app/hocs/withAuthentication'
import withAuthorization from 'app/hocs/withAuthorization'

import EventsGrid from 'app/components/EventsGrid'
import NotAuthorized from 'app/components/NotAuthorized'

export const HomePage = () => {
  return (
    <div>This is the home page.</div>
  )
}

export const Permissions = () => {
  return (
    <div>This is the permissions page</div>
  )
}

const NotAuthenticated = props => {
  const redirect = useRedirect('/')

  return (
    <div>
      Not authenticated, redirecting...
      {redirect}
    </div>
  )
}

export const routes = [
  {
    title: 'Home',
    path: '/',
    icon: HomeIcon,
    component: HomePage,
  },
  {
    title: 'Events',
    path: '/events',
    icon: PersonIcon,
    component: withAuthentication(NotAuthenticated)(EventsGrid),
    link: withForwardRef(withAuthentication()(Link)),
  },
  {
    title: 'Permissions',
    path: '/permissions',
    icon: PersonIcon,
    component: withAuthorization([], ['AuthPermissionRead'], NotAuthorized)(Permissions),
    link: withForwardRef(withAuthorization([],['AuthPermissionRead'])(Link)),
  },
]

export default routes
