import Config from 'webpack-chain'
import config from './client.base'
import path from 'path'

export default config

config
  .name(config.get('name')+'.development')
  .mode('development')
  .devtool('source-map')
  .entry('bundle')
    .add('react-devtools')
    .end()

config
  .output
    .path(path.resolve(config.output.get('path'), config.get('name')))
