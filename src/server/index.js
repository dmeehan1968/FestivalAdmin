import httpServer from './httpServer'

export const bootstrap = () => {
  let port = Number(process.env.PORT)
  port = isNaN(port) ? undefined : port
  httpServer({ port }).then(address => {
    console.log(`Listening on ${address.port}`);
  })
}

if (!module.parent) {
  bootstrap()
}
