import express from 'express'

export default app => {

  return app.get('manifest').clients.map(client => {
    // remove any protocol/host/port component
    const url = (new URL(client.publicPath, 'http://localhost/')).pathname
    return [ url, express.static(client.outputPath) ]
  })
}
