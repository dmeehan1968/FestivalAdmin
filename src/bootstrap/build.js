import assert from 'assert'
import fs from 'fs'
import path from 'path'

import debug from 'debug'
import dotenv from 'dotenv'
import webpack from 'webpack'

export const build = (options = {}) => {

  const defaults = {
    mode: process.env.NODE_ENV,
    PORT: process.env.PORT || 8000,
    DEVHOST: process.env.DEVHOST || 'http://localhost',
    DEVPORT: process.env.DEVPORT || 9000,
    withDevServer: false,
    withHMR: false,
    log: () => {},
    configs: [],
  }

  options = Object.assign({}, defaults, options)

  const {
    mode,
    withHMR,
    log,
  } = options

  let {
    PORT,
    DEVHOST,
    DEVPORT,
    configs,
  } = options

  assert(!isNaN(Number(PORT)), `PORT must convert to number, got {${PORT}}`)
  assert(!isNaN(Number(DEVPORT)), `DEVPORT must convert to number, got {${DEVPORT}}`)

  PORT = Number(PORT)
  DEVPORT = Number(DEVPORT)

  log('Loading configs...');
  configs = configs.map(config => {
    return {
      ...config,
      webpack: require(
        path.resolve(process.cwd(), 'config', 'webpack', config.config))
          .default({ withHMR, PORT, DEVHOST, DEVPORT }).toConfig()
    }
  })

  log('Creating compilers...');
  const webpackRoot = webpack(configs.map(config => config.webpack))

  // log(JSON.stringify(configs, undefined, 2));

  log(`${webpackRoot.compilers.length} configs to compile`)

  Promise.all(startCompilation(webpackRoot.compilers, log))
  .then(compilers => {
    log(`Compiled ${compilers.length} configurations`)
    process.exit()
  })
  .catch(err => {
    console.error(err);
    process.exit(1)
  })
}

export const writeStats = (output, stats, options) => {
  fs.mkdirSync(path.dirname(output), { recursive: true })
  fs.writeFileSync(output, JSON.stringify(stats.toJson(options)))
}

export const startCompilation = (compilers, log) => {

  return compilers.map(compiler => {

    const promise = new Promise((resolve, reject) => {
      compiler.hooks.compile.tap('Builder', () => {
        log(`${compiler.name}: Compiling`)
      })

      compiler.hooks.done.tap('Builder', stats => {
        log(`${compiler.name}: Compiled`)
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

      writeStats(
        path.resolve(compiler.options.output.path, '..', 'webpack-stats.json'),
        stats,
        compiler.options.stats)

    })

    return promise
  })

}

if (!module.parent) {

  dotenv.config()
  debug.enable(process.env.DEBUG)

  const packageJson = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json')))
  const options = packageJson.config[process.env.npm_lifecycle_event]

  build({
    log: debug('build'),
    ...options
  })
}
