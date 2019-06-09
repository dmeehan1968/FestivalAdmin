import Config from 'webpack-chain'
import base from './client.base'

export default base
  .name(base.get('name')+'.production')
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
        .end()
      .end()
    .end()
