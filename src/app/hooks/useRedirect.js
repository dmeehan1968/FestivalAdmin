import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'

export const useRedirect = to => {
  const [ redirect, setRedirect ] = useState(null)

  useEffect(() => {
    const timeout = setTimeout(() => setRedirect(<Redirect to={to} />), 2000)
    return () => clearTimeout(timeout)
  })

  return redirect
}

export default useRedirect
