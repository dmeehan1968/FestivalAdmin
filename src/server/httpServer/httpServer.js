import express from 'express'
import middlewares from './middlewares'

export default ({ port, ...settings }) => {
  port = port || 8000

  return new Promise((resolve) => {
    const app = express()

    Object.keys(settings).forEach(setting => app.set(setting, settings[setting]))
    
    middlewares.forEach(middleware => {
      app.use(...middleware(app))
    })

    const listener = app.listen(port, () => {
      resolve(listener.address())
    })
  })
}
