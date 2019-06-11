import React from 'react'
import ReactDomServer from 'react-dom/server'

import App from 'app/components/App'

export const root = (req, res) => {

  return Promise.resolve()
    .then(() => render(req.url))
    .then(({ status, payload }) => {
      res.status(status).send(payload)
    })

}

export const render = (url) => {

  const payload = ReactDomServer.renderToString(<App />)

  return {
    status: 200,
    payload
  }

}

export default [
  root
]
