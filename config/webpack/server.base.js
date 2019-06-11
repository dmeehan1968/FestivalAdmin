import path from 'path'

import Config from 'webpack-chain'
import nodeExternals from 'webpack-node-externals'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

import resolvers from './resolvers'

export default options => {

  const config = new Config()

  config
    .name(path.basename(__filename, '.js'))
    .target('node')
    .entry('bundle')
      .add(path.resolve(process.cwd(), 'src/server/index.js'))

  const pathPrefix = options.withHMR ? `${options.DEVHOST}:${options.DEVPORT}`: ''

  config
    .output
      .path(path.resolve(process.cwd(), 'build'))
      .filename('index.js')
      .publicPath(`${pathPrefix}/static/`)
      .chunkFilename('[name].[chunkhash:8].chunk.js')

  config
    .node
      .set('__dirname', false)

  config
    .externals([
      nodeExternals(),
    ])

  config
    .module
      .rule('compile')
        .test(/\.jsx?$/)
        .use('babel')
          .loader('babel-loader')
          .options({
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'usage',
                  corejs: '3.0.1',
                  modules: false,
                  targets: {
                    node: true,
                  }
                },
              ],
              '@babel/preset-react',
            ],
            plugins: [
              [
                'babel-plugin-styled-components',
                {
                  ssr: true,
                  displayName: true,
                  minify: true,
                  transpileTemplateLiterals: true,
                },
              ],
              'inline-dotenv',
            ],
          })

  config
    .plugin('clean')
      .use(CleanWebpackPlugin)

  config
    .stats('normal')

  resolvers(config)

  return config
}
