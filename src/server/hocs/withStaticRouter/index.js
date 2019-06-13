import React from 'react'
import { StaticRouter } from 'react-router-dom'

export const withStaticRouter = WrappedComponent => {
  return ({ location, context, ...props }) => {
    return (
      <StaticRouter location={location} context={context}>
        <WrappedComponent {...props} />
      </StaticRouter>
    )
  }
}

export default withStaticRouter
