import React, { useContext, useState } from 'react'

import faker from 'faker'

const Authentication = React.createContext()

export const useAuthentication = () => useContext(Authentication)

export const AuthenticationProvider = ({
  children,
}) => {

  const [ isAuthenticated, setIsAuthenticated ] = useState(false)

  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()

  const context = {
    isAuthenticated,
    user: isAuthenticated ? {
      avatar: faker.image.avatar(),
      firstName,
      lastName,
      initials: firstName[0] + lastName[0],
    } : null,
    login: () => setIsAuthenticated(!isAuthenticated),
    logout: () => setIsAuthenticated(!isAuthenticated),
  }

  return (
    <Authentication.Provider value={context}>
      {children}
    </Authentication.Provider>
  )
}

export default AuthenticationProvider
