import React, { useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'

// Icons
import HomeIcon from '@material-ui/icons/Home'
import PersonIcon from '@material-ui/icons/Person'

import { useAuthentication } from 'app/components/AuthenticationProvider'
import useRedirect from 'app/hooks/useRedirect'
import withForwardRef from 'app/hocs/withForwardRef'
import withAuthentication from 'app/hocs/withAuthentication'

import EventsGrid from 'app/components/EventsGrid'

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

const NotAuthorized = props => {
  const redirect = useRedirect('/')

  return (
    <div>
      Not Authorized, redirecting...
      {redirect}
    </div>
  )
}

const withAuthorization = (roles = [], permissions = [], PlaceholderComponent = (() => null)) => WrappedComponent => ({ forwardRef, ...props }) => {
  const { hasRole, hasPermission } = useAuthentication()
  let isAuthorized = roles.reduce((acc, role) => {
    return acc && hasRole(role)
  }, true)

  isAuthorized = permissions.reduce((acc, perm) => {
    return acc && hasPermission(perm)
  }, isAuthorized)

  return isAuthorized ?
    <WrappedComponent {...props} ref={forwardRef} />
    :
    <PlaceholderComponent {...props} />
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
