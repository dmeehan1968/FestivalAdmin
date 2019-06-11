import builder from './server.base'
import path from 'path'

export default (options) => {

  const config = builder(options)

  config
    .name(path.basename(__filename, '.js'))
    .mode('production')

  config
    .output
      .path(path.resolve(config.output.get('path'), config.get('name'), 'static'))

  return config
}
