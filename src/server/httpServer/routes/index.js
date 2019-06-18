import React from 'react'

import renderComponentToHtmlResponse from 'server/httpServer/renderComponentToHtmlResponse'

const Placeholder = () => <div>App Loading...</div>
export const root = (req, res, next) => {

  return Promise.resolve()
    .then(() => renderComponentToHtmlResponse(req)(Placeholder))
    .then(({ status, payload }) => {
      return res
        .status(status || 200)
        .send(payload)
        .end()
    })
    .catch(next)

}

export default [
  [ 'get', '/*', root ]
]
