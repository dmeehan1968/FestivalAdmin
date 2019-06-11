import Config from 'webpack-chain'
import builder from './client.production'
import path from 'path'

export default (options) => {

  const config = builder(options)

  config
    .name(path.basename(__filename, '.js'))
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
                      browsers: [
                        'Chrome >= 60',
                        'Safari >= 10.1',
                        'iOS >= 10.3',
                        'Firefox >= 54',
                        'Edge >= 15',
                      ],
                    },
                  },
                ],
              ],
            },
          })

  config
    .output
      .path(path.resolve(config.output.get('path'), '..', '..', config.get('name'), 'static'))
      .publicPath('/static.es6/')

  return config
}
