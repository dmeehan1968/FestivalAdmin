import React from 'react'
import { StaticRouter } from 'react-router-dom'

export const AdminApp = ({
  location,
  context,
}) => {
  return (
    <StaticRouter location={location} context={context}>
      <h1>Hello World</h1>
    </StaticRouter>
  )
}

export default AdminApp
