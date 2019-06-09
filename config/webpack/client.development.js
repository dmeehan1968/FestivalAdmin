import Config from 'webpack-chain'
import config from './client.base'

export default config

config
  .name(config.get('name')+'.development')
  .mode('development')
  .devtool('source-map')
  .entry('bundle')
    .add('react-devtools')
    .end()
