import Config from 'webpack-chain'
import config from './client.base'
import path from 'path'

export default config

config
  .name(config.get('name')+'.production')
  .mode('production')
  .devtool('none')
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
                  targets: '> 0.25%, not dead'
                },
              ]
            ],
          },
        })

config
  .output
    .path(path.resolve(config.output.get('path'), config.get('name')))
