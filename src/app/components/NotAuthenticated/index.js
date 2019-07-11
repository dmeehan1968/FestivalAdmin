import React from 'react'

import useRedirect from 'app/hooks/useRedirect'

export const NotAuthenticated = props => {
  const redirect = useRedirect('/')

  return (
    <div>
      Not authenticated, redirecting...
      {redirect}
    </div>
  )
}

export default NotAuthenticated
