import express from 'express'

export default (options = {}) => {
  const defaults = {
    port: 8000
  }
  options.port = options.port || defaults.port

  return new Promise((resolve) => {
    const app = express()
    const listener = app.listen(options.port, () => {
      resolve(listener.address())
    })
  })
}
