import React from 'react'

import AdminApp from 'app/components/AdminApp'
import renderComponentToHtmlResponse from 'server/httpServer/renderComponentToHtmlResponse'

export const root = (req, res, next) => {

  return Promise.resolve()
    .then(() => renderComponentToHtmlResponse(AdminApp, req))
    .then(({ status, payload }) => {
      res.status(status || 200).send(payload).end()
    })
    .catch(next)

}

export default [
  [ 'get', '/*', root ]
]
