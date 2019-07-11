import React from 'react'

import { useAuthentication } from 'app/components/AuthenticationProvider'

export const withAuthorization = (roles = [], permissions = [], PlaceholderComponent = (() => null)) => WrappedComponent => ({ forwardRef, ...props }) => {
  const { hasRole, hasPermission } = useAuthentication()
  let isAuthorized = roles.reduce((acc, role) => {
    return acc && hasRole(role)
  }, true)

  isAuthorized = permissions.reduce((acc, perm) => {
    return acc && hasPermission(perm)
  }, isAuthorized)

  return isAuthorized ?
    <WrappedComponent {...props} ref={forwardRef} />
    :
    <PlaceholderComponent {...props} />
}

export default withAuthorization
