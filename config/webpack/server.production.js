import config from './server.base'
import path from 'path'

export default config

config
  .name(config.get('name')+'.production')
  .mode('production')

config
  .output
    .path(path.resolve(config.output.get('path'), config.get('name')))
