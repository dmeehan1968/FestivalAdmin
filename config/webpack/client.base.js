import path from 'path'
import Config from 'webpack-chain'
import ManifestPlugin from 'webpack-manifest-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import resolvers from './resolvers'

export default options => {

  const config = new Config()

  config
    .name(path.basename(__filename, '.js'))
    .target('web')
    .entry('bundle')
      .add(path.resolve(process.cwd(), 'src/client/index.js'))

  const pathPrefix = options.withHMR ? `${options.DEVHOST}:${options.DEVPORT}`: ''

  config
    .output
      .path(path.resolve(process.cwd(), 'build'))
      .filename('index.js')
      .publicPath(`${pathPrefix}/static/`)
      .chunkFilename('[name].[chunkhash:8].chunk.js')

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
            ],
          })

  config
    .plugin('manifest')
      .use(ManifestPlugin)

  config
    .plugin('clean')
      .use(CleanWebpackPlugin)

  config
    .stats('normal')

  resolvers(config)

  return config
}
