import path from 'path'
import Config from 'webpack-chain'
import ManifestPlugin from 'webpack-manifest-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

const config = new Config()

export default config

config
  .name('client.base')
  .target('web')
  .entry('bundle')
    .add(path.resolve(process.cwd(), 'src/client/index.js'))

config
  .output
    .path(path.resolve(process.cwd(), 'build'))
    .filename('index.js')
    .publicPath('/static/')
    .chunkFilename('[name].[chunkhash:8].chunk.js')

config
  .module
    .rule('compile')
      .test(/\.jsx?$/)
      .include
        .add(path.resolve(process.cwd(), 'src/client/index.js'))
        .end()
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
