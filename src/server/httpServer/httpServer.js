import express from 'express'
import middlewares from './middlewares'
import routes from './routes'
import loadServerManifest from './loadServerManifest'
import debug from 'debug'

export default ({ port, ...settings } = {}, log = debug('httpServer')) => {
  port = port || 8000
  const logSetting = log.extend('setting')
  const logMiddleware = log.extend('middleware')
  const logRoutes = log.extend('route')

  return new Promise((resolve) => {

    log('Configuring...')
    const app = express()

    settings.manifest = loadServerManifest()

    Object.keys(settings).forEach(setting => {
      logSetting(setting)
      app.set(setting, settings[setting])
    })

    flattenMiddleware(middlewares, app, logMiddleware)

    routes.forEach(([ method, ...params ]) => {
      logRoutes(method, params)
      app[method](...params)
    })

    log(('Listening...'))
    const listener = app.listen(port, () => {
      resolve(listener.address())
    })
  })
}

export const flattenMiddleware = (middlewares, app, log) => {
  return middlewares.forEach(middleware => {
    middleware = middleware(app)
    log(middleware)
    middleware = Array.isArray(middleware[0]) ? middleware : [ middleware ]
    middleware.forEach(args => app.use(...args))
  })
}
