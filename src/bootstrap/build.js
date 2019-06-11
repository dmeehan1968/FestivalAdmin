import assert from 'assert'
import fs from 'fs'
import path from 'path'

import debug from 'debug'
import dotenv from 'dotenv'
import webpack from 'webpack'

import { writeStats, startCompilation } from './start'

export const build = (options = {}) => {

  const defaults = {
    PORT: process.env.PORT || 8000,
    DEVHOST: process.env.DEVHOST || 'http://localhost',
    DEVPORT: process.env.DEVPORT || 9000,
    log: () => {},
    configs: [],
  }

  options = Object.assign({}, defaults, options)

  const {
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
    config.options = config.options || {}
    return {
      ...config,
      webpack: require(
        path.resolve(process.cwd(), 'config', 'webpack', config.config))
          .default({ PORT, DEVHOST, DEVPORT, ...config.options }).toConfig()
    }
  })

  log('Creating compilers...');
  const webpackRoot = webpack(configs.map(config => config.webpack))

  // log(JSON.stringify(configs, undefined, 2));

  log(`${webpackRoot.compilers.length} configs to compile`)

  Promise.all(startCompilations(webpackRoot.compilers, log))
  .then(compilers => {
    log(`Compiled ${compilers.length} configurations`)
    process.exit()
  })
  .catch(err => {
    console.error(err);
    process.exit(1)
  })
}

export const startCompilations = (compilers, log) => {

  return compilers.map(compiler => startCompilation(compiler, log))

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
