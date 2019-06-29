import { useState } from 'react'

export const useAuthMode = () => {
  const [ authMode, setAuthMode ] = useState('login')
  return {
    setAuthMode,
    isLogin() {
      return authMode === 'login'
    },
    isSignup() {
      return authMode === 'signup'
    }
  }
}

export default useAuthMode
