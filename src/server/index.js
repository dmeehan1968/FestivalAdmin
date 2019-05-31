import server from './server'

export const bootstrap = () => {
    server()
}

if (!module.parent) {
  bootstrap()
}
