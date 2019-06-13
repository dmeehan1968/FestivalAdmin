import Config from 'webpack-chain'
import builder from './client.base'
import path from 'path'
import { HotModuleReplacementPlugin } from 'webpack'

export default (options) => {

  const config = builder(options)

  config
    .name(path.basename(__filename, '.js'))
    .mode('development')
    .devtool('source-map')
    .entry('bundle')
      .add('react-devtools')
      .end()

      .module
        .rule('compile')
          .use('babel')
            .loader('babel-loader')
            .merge({
              options: {
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      targets: {
                        esmodules: true,
                      },
                    },
                  ],
                ],
              },
            })

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

    config
      .plugin('hmr')
      .use(HotModuleReplacementPlugin)

  }

  return config
}
