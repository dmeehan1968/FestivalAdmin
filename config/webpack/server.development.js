import builder from './server.base'
import path from 'path'
import { BannerPlugin, HotModuleReplacementPlugin } from 'webpack'

export default (options) => {

  const config = builder(options)

  config
    .name(path.basename(__filename, '.js'))
    .mode('development')
    .devtool('source-map')

  config
    .output
      .path(path.resolve(config.output.get('path'), config.get('name'), 'static'))

  config
    .plugin('banner')
    .use(BannerPlugin, [{
        banner: 'require("source-map-support").install();',
        test: /\.js$/,
        raw: true,
        entryOnly: false
      }])

  if (options.withHMR) {

    config
      .plugin('hmr')
      .use(HotModuleReplacementPlugin)

    config
      .output
        .hotUpdateMainFilename('updates/[hash].hot-update.json')
        .hotUpdateChunkFilename('updates/[id].[hash].hot-update.js')

  }

  return config

}
