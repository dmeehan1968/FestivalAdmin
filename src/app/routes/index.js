import React from 'react'

// Icons
import HomeIcon from '@material-ui/icons/Home'
import PersonIcon from '@material-ui/icons/Person'

export const HomePage = () => {
  return (
    <div>This is the home page.</div>
  )
}

export const ProfilePage = () => {
  return (
    <div>This is the user profile page.</div>
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
    title: 'Profile',
    path: '/profile',
    icon: PersonIcon,
    component: ProfilePage,
  },
]

export default routes
