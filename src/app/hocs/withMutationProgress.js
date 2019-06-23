import React, { useState } from 'react'

export const withMutationProgress = ({
  propName = 'mutate',
  fakeLatencyMs = 0,
}) => {

  const EnhancedComponent = WrappedComponent => ({
    onBeginUpdate,
    onEndUpdate,
    ...props
  }) => {

    const [ updating, setUpdating ] = useState({})

    return (
      <WrappedComponent
        {...props}
        updating={updating}
        {...{
          [propName]: (...args) => {
            return Promise.resolve()
            .then(()=>setUpdating(...args))
            .then(()=>new Promise(resolve => setTimeout(resolve, fakeLatencyMs)))
            .then(()=>props[propName](...args))
            .finally(()=>setUpdating({}))
          }
        }}
      />
    )

  }

  return EnhancedComponent

}

export default withMutationProgress
