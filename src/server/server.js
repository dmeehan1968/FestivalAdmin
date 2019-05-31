import httpServer from './httpServer'

export default () => {
  let port = Number(process.env.PORT)
  port = isNaN(port) ? undefined : port
  httpServer({ port }).then(address => {
    console.log(`Listening on ${address.port}`);
  })
}
