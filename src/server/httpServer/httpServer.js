import express from 'express'
import middlewares from './middlewares'
import routes from './routes'
import loadServerManifest from './loadServerManifest'

export default ({ port, ...settings } = {}) => {
  port = port || 8000

  return new Promise((resolve) => {
    const app = express()

    Object.keys(settings).forEach(setting => app.set(setting, settings[setting]))

    app.set('manifest', loadServerManifest())

    middlewares.forEach(middleware => {
      app.use(...middleware(app))
    })

    routes.forEach(([ method, ...params ]) => {
      app[method](...params)
    })

    const listener = app.listen(port, () => {
      resolve(listener.address())
    })
  })
}
