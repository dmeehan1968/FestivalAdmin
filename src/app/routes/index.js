import React, { useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'

// Icons
import HomeIcon from '@material-ui/icons/Home'
import PersonIcon from '@material-ui/icons/Person'

import { useAuthentication } from 'app/components/AuthenticationProvider'

export const HomePage = () => {
  return (
    <div>This is the home page.</div>
  )
}

export const ProfilePage = () => {
  const { user } = useAuthentication()
  return (
    user && <div>This is the user profile page for {user.firstName} {user.lastName}.</div>
  )
}

const withForwardRef = WrappedComponent => React.forwardRef((props, ref) =>
  <WrappedComponent forwardRef={ref} {...props} />
)

const NotAuthenticated = props => {
  const [ redirect, setRedirect ] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setRedirect(true), 2000)
    return () => clearTimeout(timeout)
  })

  return (
    <div>
      Not authenticated, redirecting...
      {redirect && <Redirect to="/" />}
    </div>
  )
}

const withAuthentication = (PlaceholderComponent = (() => null)) => WrappedComponent => ({ forwardRef, ...props }) => {
  const { isAuthenticated } = useAuthentication()
  return isAuthenticated ?
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
    title: 'Profile',
    path: '/profile',
    icon: PersonIcon,
    component: withAuthentication(NotAuthenticated)(ProfilePage),
    link: withForwardRef(withAuthentication()(Link)),
  },
]

export default routes
