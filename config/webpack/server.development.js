import builder from './server.base'
import path from 'path'
import { BannerPlugin } from 'webpack'

export default ({ withHMR }) => {

  const config = builder({ withHMR })

  config
    .name(config.get('name')+'.development')
    .mode('development')

  config
    .output
      .path(path.resolve(config.output.get('path'), config.get('name')))

  config
    .plugin('banner')
    .use(BannerPlugin, [{
        banner: 'require("source-map-support").install();',
        test: /\.js$/,
        raw: true,
        entryOnly: false
      }])

  return config

}
