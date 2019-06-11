import Config from 'webpack-chain'
import builder from './client.base'
import path from 'path'

export default (options) => {

  const config = builder(options)

  config
    .name(path.basename(__filename, '.js'))
    .mode('development')
    .devtool('source-map')
    .entry('bundle')
      .add('react-devtools')
      .end()

  config
    .output
      .path(path.resolve(config.output.get('path'), config.get('name'), 'static'))

  if (options.withHMR) {

    config
      .entry('bundle')
        .add(`webpack-hot-middleware/client?path=${options.DEVHOST}:${options.DEVPORT}/__webpack_hmr`)

    config
      .output
        .hotUpdateMainFilename('updates/[hash].hot-update.json')
        .hotUpdateChunkFilename('updates/[id].[hash].hot-update.js')

  }

  return config
}
