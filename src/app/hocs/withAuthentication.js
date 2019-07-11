import React from 'react'

import { useAuthentication } from 'app/components/AuthenticationProvider'

export const withAuthentication = (PlaceholderComponent = (() => null)) => WrappedComponent => ({ forwardRef, ...props }) => {
  const { isAuthenticated } = useAuthentication()
  return isAuthenticated ?
    <WrappedComponent {...props} ref={forwardRef} />
    :
    <PlaceholderComponent {...props} />
}

export default withAuthentication
