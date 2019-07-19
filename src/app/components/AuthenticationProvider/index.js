import React, { useContext, useState, useEffect } from 'react'

import jwt from 'jsonwebtoken'

import useAuthLogin from 'app/hooks/useAuthLogin'
import useAuthSignup from 'app/hooks/useAuthSignup'

import rsaPublicKey from 'root/.rsa.pub'

const Authentication = React.createContext()

export const useAuthentication = () => useContext(Authentication)

export const useAuthStorage = (store, key = 'auth_token') => {
  return {
    setItem(value) {
      return store.setItem(key, value)
    },
    getItem() {
      return store.getItem(key)
    },
    removeItem() {
      return store.removeItem(key)
    }
  }
}

export const AuthenticationProvider = ({
  children,
  redirect_url = '/',
  history = window.history,
}) => {

  const [ user, setUser ] = useState(null)
  const login = useAuthLogin()
  const signup = useAuthSignup()
  const store = useAuthStorage(window.sessionStorage)

  const authenticateFromToken = (token, appState) => {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        rsaPublicKey,
        { algorithms: [ 'RS256' ] },
        (err, user) => {
          if (err) return reject(err)
          store.setItem(token)
          resolve(user)
        }
      )
    })
    .then(user => {
      setUser(user)
    })
    .then(() => {
      if (appState && appState.from) {
        history.push(appState.from, appState)
      } else {
        history.push(redirect_url)
      }
    })
    .catch(error => {
      throw new Error('Decryption Failure')
    })
  }

  useEffect(() => {
    // validate token on first render
    const token = store.getItem()
    if (token) {
      authenticateFromToken(token, { from: window.location.pathname })
      .catch(() => {
        store.removeItem()
      })
    }
  }, [])

  useEffect(() => {
    // validate users expiry date on each render
    if (user && user.exp*1000 < Date.now()) {
      setUser(null)
    }
  })

  const handleLogin = (email, password, appState) => {
    return login(email, password).then(token => authenticateFromToken(token, appState))
  }

  const handleLogout = () => {
    setUser(null)
    store.removeItem()
  }

  const handleSignup = (email, password, confirmPassword, appState) => {
    return signup(email,password,confirmPassword).then(token => authenticateFromToken(token, appState))
  }

  const hasPermission = (name) => {
    return !!user && !!user.permissions[name]
  }

  const hasRole = (name) => {
    return !!user && !!user.roles[name]
  }

  const context = {
    isAuthenticated: !!user,
    user,
    login: handleLogin,
    logout: handleLogout,
    signup: handleSignup,
    hasPermission,
    hasRole,
  }

  return (
    <Authentication.Provider value={context}>
      {children}
    </Authentication.Provider>
  )
}

export default AuthenticationProvider
