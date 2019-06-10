import config from './server.base'
import path from 'path'

export default config

config
  .name(config.get('name')+'.development')
  .mode('development')

config
  .output
    .path(path.resolve(config.output.get('path'), config.get('name')))
