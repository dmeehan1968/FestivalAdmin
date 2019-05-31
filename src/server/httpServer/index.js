import express from 'express'
import middlewares from './middlewares'

export default (options = {}) => {
  const defaults = {
    port: 8000
  }
  options.port = options.port || defaults.port

  return new Promise((resolve) => {
    const app = express()

    middlewares.forEach(middleware => {
      app.use(...middleware)
    })

    const listener = app.listen(options.port, () => {
      resolve(listener.address())
    })
  })
}
