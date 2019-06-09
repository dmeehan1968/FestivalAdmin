import path from 'path'

import Config from 'webpack-chain'

export default (new Config())
  .name('client.base')
  .target('web')
  .entry('bundle')
    .add(path.resolve(process.cwd(), 'src/client/index.js'))
    .end()
  .output
    .path(path.resolve(process.cwd(), 'build'))
    .filename('client.bundle.js')
    .publicPath('/static/')
    .chunkFilename('[name].[chunkhash:8].chunk.js')
    .end()
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
        .end()
      .end()
    .end()
