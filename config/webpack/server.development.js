import config from './server.base'

export default config

config
  .name(config.get('name')+'.development')
  .mode('development')
