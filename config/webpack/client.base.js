import path from 'path'
import Config from 'webpack-chain'
import ManifestPlugin from 'webpack-manifest-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import resolvers from './resolvers'
import Dotenv from 'dotenv-webpack'

export default options => {

  const config = new Config()

  config
    .name(path.basename(__filename, '.js'))
    .target('web')
    .entry('bundle')
      .add(path.resolve('src/client/index.js'))

  const pathPrefix = options.withHMR ? `${options.DEVHOST}:${options.DEVPORT}`: ''

  config
    .output
      .path(path.resolve('build'))
      .filename('index.js')
      .publicPath(`${pathPrefix}/static/`)
      .chunkFilename('[name].[chunkhash:8].chunk.js')

  config
    .module
      .rule('compile')
        .test(/\.jsx?$/)
        .exclude
          .add(/node_modules/)
          .end()
        .use('babel')
          .loader('babel-loader')
          .options({
            presets: [
              [
                '@babel/preset-env',
                {
                  modules: false,
                },
              ],
              '@babel/preset-react',
            ],
            plugins: [
              "@babel/plugin-proposal-class-properties",
              [
                'babel-plugin-styled-components',
                {
                  ssr: true,
                  displayName: true,
                  minify: true,
                  transpileTemplateLiterals: true,
                },
              ],
            ],
          })

  config
    .plugin('manifest')
      .use(ManifestPlugin)

  config
    .plugin('dotenv')
      .use(Dotenv)

  config
    .plugin('clean')
      .use(CleanWebpackPlugin)

  config
    .stats('normal')

  resolvers(config)

  return config
}
