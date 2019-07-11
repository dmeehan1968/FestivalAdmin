import React from 'react'

import useRedirect from 'app/hooks/useRedirect'

export const NotAuthorized = props => {
  const redirect = useRedirect('/')

  return (
    <div>
      Not Authorized, redirecting...
      {redirect}
    </div>
  )
}

export default NotAuthorized
