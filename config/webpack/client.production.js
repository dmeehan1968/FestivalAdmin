import Config from 'webpack-chain'
import builder from './client.base'
import path from 'path'

export default ({ withHMR }) => {

  const config = builder({ withHMR })

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

  return config
}
