import React, { useContext } from 'react'

const Authentication = React.createContext()

export const useAuthentication = () => useContext(Authentication)

export const AuthenticationProvider = props => {

  const context = {
    isAuthenticated: true,
  }

  return (
    <Authentication.Provider value={context}>
      {props.children}
    </Authentication.Provider>
  )
}

export default AuthenticationProvider
