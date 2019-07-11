import React from 'react'

export const withForwardRef = WrappedComponent => React.forwardRef((props, ref) =>
  <WrappedComponent forwardRef={ref} {...props} />
)

export default withForwardRef
