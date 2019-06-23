import React from 'react'

export const withProps = injectedProps => WrappedComponent => props => {
  return (
    <WrappedComponent
      {...injectedProps}
      {...props}
    />
  )
}

export default withProps
