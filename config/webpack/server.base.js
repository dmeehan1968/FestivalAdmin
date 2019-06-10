import path from 'path'

import Config from 'webpack-chain'
import nodeExternals from 'webpack-node-externals'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

const config = new Config()

export default config

config
  .name('server.base')
  .target('node')
  .entry('bundle')
    .add(path.resolve(process.cwd(), 'src/server/index.js'))

config
  .output
    .path(path.resolve(process.cwd(), 'build'))
    .filename('index.js')
    .publicPath('/static/')
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
      .include
        .add(path.resolve(process.cwd(), 'src/server/index.js'))
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

config
  .resolve
    .alias
      .set('client', path.resolve(process.cwd(), 'src/client/'))
      .set('server', path.resolve(process.cwd(), 'src/server/'))
