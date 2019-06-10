import webpackConfig from '../config/webpack'
import webpack from 'webpack'
import fs from 'fs'
import path from 'path'

export const build = ({
  // options
} = {
  // defaults
}) => {

  const configs = webpackConfig({ mode: process.env.NODE_ENV })
  const webpackRoot = webpack(configs)

  // console.log(JSON.stringify(configs, undefined, 2));

  const clientConfigs = webpackRoot.compilers.filter(compiler => compiler.name && compiler.name.match(/^client/))
  const serverConfigs = webpackRoot.compilers.filter(compiler => compiler.name && compiler.name.match(/^server/))

  console.log(`${clientConfigs.length} clients, ${serverConfigs.length} servers`)

  Promise.all(startCompilation([ ...clientConfigs, ...serverConfigs ]))
  .then(compilers => {
    console.log(`Compiled ${compilers.length} of ${webpackRoot.compilers.length} configurations`)
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
        console.log(`${compiler.name}: Compiling`)
      })

      compiler.hooks.done.tap('Builder', stats => {
        console.log(`${compiler.name}: Compiled`)
        if (stats.hasErrors()) {
          return reject(`${compiler.name}: Failed to compile`)
        }
        return resolve(compiler)
      })
    })

    compiler.watch({
      // options
      ignored: /^node_modules/,
      stats: compiler.options.stats,
    }, (error, stats) => {
      // reporter
      if (error) {
        console.error(error);
      }

      if (stats.hasErrors()) {
        const message = stats.toJson().errors[0].split('\n').slice(0,3).join('\n')
        console.error(`${compiler.name}: ${message}`)
      }

      const dir = path.resolve(compiler.options.output.path, '../stats')
      fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(path.resolve(dir, `${compiler.options.name}.json`), JSON.stringify(stats.toJson(compiler.options.stats)))
    })

    return promise
  })

}

if (!module.parent) {
  build()
}
