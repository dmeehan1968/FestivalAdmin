import Config from 'webpack-chain'
import base from './client.base'

export default base
  .name(base.get('name')+'.development')
  .mode('development')
  .devtool('source-map')
  .entry('bundle')
    .add('react-devtools')
    .end()
