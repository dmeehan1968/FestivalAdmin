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

    flattenMiddleware(middlewares, app).forEach(middleware => {
      logMiddleware(middleware)
      app.use(...middleware)
    })

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

export const flattenMiddleware = (middlewares, app) => {
  return middlewares.reduce((acc, middleware) => {
    middleware = middleware(app)
    return [ ...acc, ...Array.isArray(middleware[0]) ? middleware : [middleware]]
  }, [])
}
