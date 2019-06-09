import webpackConfig from '../config/webpack'
import webpack from 'webpack'

const configs = webpackConfig({ mode: process.env.NODE_ENV })

export const build = ({
  // options
} = {
  // defaults
}) => {

  const webpackRoot = webpack(configs)

  // console.log(JSON.stringify(configs, undefined, 2));

  const clientCompilers = webpackRoot.compilers.filter(compiler => compiler.name && compiler.name.match(/^client/))
  const serverCompilers = webpackRoot.compilers.filter(compiler => compiler.name && compiler.name.match(/^server/))

  console.log(`${clientCompilers.length} clients, ${serverCompilers.length} servers`)

  Promise.all(startCompilation([ ...clientCompilers, ...serverCompilers ]))
  .then(compilers => {
    console.log(`${compilers.length} Done`)
    process.exit()
  })
  .catch(err => {
    console.error(err);
    process.exit(1)
  })
}

export const startCompilation = (compilers) => {

  return compilers.map(compiler => {

    const promise = new Promise((resolve, reject) => {
      compiler.hooks.compile.tap('Builder', () => {
        console.log(`[${compiler.name}] Compiling`)
      })

      compiler.hooks.done.tap('Builder', stats => {
        console.log(`[${compiler.name}] Compiled`)
        if (stats.hasErrors()) {
          return reject(`[${compiler.name}] Failed to compile`)
        }
        return resolve(compiler)
      })
    })

    compiler.watch({
      // options
      ignored: /^node_modules/,
    }, (error, stats) => {
      // reporter
      if (error) {
        console.error(error);
      }

      if (stats.hasErrors()) {
        const message = stats.toJson().errors[0].split('\n').slice(0,3).join('\n')
        console.error(`[${compiler.name}] ${message}`)
      }
    })

    return promise
  })

}

if (!module.parent) {
  build()
}
