import React from 'react'

export const withLoading = Loading => WrappedComponent => ({loading, ...props}) => {
  return loading && <Loading /> || <WrappedComponent {...props} />
}

export default withLoading
