import React, { useContext, useState } from 'react'

import faker from 'faker'
import jwt from 'jsonwebtoken'

import useAuthLogin from 'app/hooks/useAuthLogin'
import useAuthSignup from 'app/hooks/useAuthSignup'

import rsaPublicKey from 'root/.rsa.pub'

const Authentication = React.createContext()

export const useAuthentication = () => useContext(Authentication)

export const AuthenticationProvider = ({
  children,
}) => {

  const [ isAuthenticated, setIsAuthenticated ] = useState(false)
  const [ user, setUser ] = useState(null)
  const login = useAuthLogin()
  const signup = useAuthSignup()

  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()

  const authenticateFromToken = token => {
    const user = jwt.verify(token, rsaPublicKey, { algorithm: 'RS256' })
    console.log('user', user);
    setIsAuthenticated(true)
    setUser(user)
  }

  const handleLogin = (email, password) => {
    return login(email, password).then(authenticateFromToken)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUser(null)
  }

  const handleSignup = (email, password, confirmPassword) => {
    return signup(email,password,confirmPassword).then(authenticateFromToken)
  }

  const context = {
    isAuthenticated,
    user,
    login: handleLogin,
    logout: handleLogout,
    signup: handleSignup
  }

  return (
    <Authentication.Provider value={context}>
      {children}
    </Authentication.Provider>
  )
}

export default AuthenticationProvider
