import server from './server'

export const bootstrap = () => {
  let port = Number(process.env.PORT)
  port = isNaN(port) ? undefined : port
  server({ port }).then(address => {
    console.log(`Listening on ${address.port}`);
  })
}

if (!module.parent) {
  bootstrap()
}
