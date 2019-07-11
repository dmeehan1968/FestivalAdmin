import { useState, useEffect } from 'react'

export const useRedirect = to => {
  const [ redirect, setRedirect ] = useState(null)

  useEffect(() => {
    const timeout = setTimeout(() => setRedirect(<Redirect to={to} />), 2000)
    return () => clearTimeout(timeout)
  })

  return redirect
}

export default useRedirect
