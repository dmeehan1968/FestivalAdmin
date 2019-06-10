import builder from './server.base'
import path from 'path'

export default ({ withHMR }) => {

  const config = builder({ withHMR })

  config
    .name(config.get('name')+'.production')
    .mode('production')

  config
    .output
      .path(path.resolve(config.output.get('path'), config.get('name')))

  return config
}
