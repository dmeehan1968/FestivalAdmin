import React from 'react'
import ReactDomServer from 'react-dom/server'

import AdminApp from 'app/components/AdminApp'

export const root = (req, res, next) => {

  return Promise.resolve()
    .then(() => render(req.url))
    .then(({ status, payload }) => {
      res.status(status).send(payload)
    })
    .catch(next)

}

export const render = (url) => {

  const context = { status: 200 }

  const payload = ReactDomServer.renderToString(
    <AdminApp location={url} context={context}/>
  )

  return {
    status: context.status,
    payload
  }

}

export default [
  [ '/*', root ]
]
