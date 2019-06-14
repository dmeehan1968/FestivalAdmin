import assert from 'assert'
import fs from 'fs'
import path from 'path'

import debug from 'debug'
import dotenv from 'dotenv'
import express from 'express'
import nodemon from 'nodemon'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackDevMiddlewareReporter from 'webpack-dev-middleware/lib/reporter'
import webpackHotMiddleware from 'webpack-hot-middleware'

export const start = (options = {}) => {

  const defaults = {
    PORT: process.env.PORT,
    DEVHOST: process.env.DEVHOST || 'http://localhost',
    DEVPORT: Number(process.env.PORT)+1,
    log: () => {},
    server: {},
  }

  options = Object.assign({}, defaults, options)

  const {
    log,
  } = options

  let {
    PORT,
    DEVHOST,
    DEVPORT,
    server,
  } = options

  assert(!isNaN(Number(PORT)), `PORT must convert to number, got {${PORT}}`)
  assert(!isNaN(Number(DEVPORT)), `DEVPORT must convert to number, got {${DEVPORT}}`)

  PORT = Number(PORT)
  DEVPORT = Number(DEVPORT)


  log('Loading server config...');
  server.options = server.options || {}
  server.webpack = require(path.resolve('config', 'webpack', server.config)).default({ PORT, DEVHOST, DEVPORT, ...server.options }).toConfig()

  log('Loading client configs...');
  server.clients.forEach(client => {
    client.options = client.options || {}
    client.webpack = require(path.resolve('config', 'webpack', client.config)).default({ PORT, DEVHOST, DEVPORT, ...client.options }).toConfig()
  })

  log('Creating compilers...');
  const serverCompiler = webpack(server.webpack)
  const clientCompiler = webpack(server.clients.map(client => client.webpack))

  startCompilation(serverCompiler, log)
  .then(() => writeServerClientManifest(server))
  .then(() => {
    return startDevServer(clientCompiler, {
      DEVHOST,
      DEVPORT,
      ...server.options,
    }, log)
  })
  .then(() => {
    log(`Server [${server.config}] with ${clientCompiler.compilers.length} clients`)
    return startAppServer(serverCompiler, {
      PORT,
      DEBUG: process.env.DEBUG,
      ...server.options,
    }, log)
  })

}

export const writeServerClientManifest = (server) => {
  const clients = server.clients.map(client => {
    return {
      module: !!client.options.usesModules,
      manifest: path.resolve(client.webpack.output.path, 'manifest.json'),
      outputPath: client.webpack.output.path,
      publicPath: client.webpack.output.publicPath,
    }
  })

  const manifest = {
    clients,
    outputPath: server.webpack.output.path,
    publicPath: server.webpack.output.publicPath,
  }

  fs.mkdirSync(server.webpack.output.path, { recursive: true })
  fs.writeFileSync(path.resolve(server.webpack.output.path, 'clients.json'), JSON.stringify(manifest))
}

export const startCompilation = (compiler, log) => {

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
      compiler.options.output.path,
      stats.toJson(compiler.options.stats))

  })

  return promise

}

export const startAppServer = (compiler, options, log) => {

  const nodemonOptions = {
    script: path.resolve(compiler.options.output.path, compiler.options.output.filename),
    watch: [
      path.dirname(compiler.options.output.path),
      path.resolve('.env'),
      ...(options.watch || []).map(dir => path.resolve(dir)),
    ],
    ignore: [
      getStatsFile(compiler.options.output.path),             // stats
      path.resolve(compiler.options.output.path, 'updates'),  // HMR
    ],
    env: {
      ...(options.DEBUG && { DEBUG: options.DEBUG } || {}),
      ...(options.PORT && { PORT: options.PORT } || {}),
      ...(options.env || {})
    }
  }

  const script = nodemon(nodemonOptions);

  script.on('restart', (files) => {
    files.forEach(file => {
      log(`${compiler.options.name}: changed - ${path.relative(process.cwd(), file)}`)
    })
    log(`${compiler.options.name}: restarting`);
  });

  script.on('quit', () => {
    log(`${compiler.options.name}: process ended`);
    process.exit();
  });

  script.on('error', () => {
    log(`${compiler.options.name}: an error occured`);
    process.exit(1);
  });

}

export const getStatsFile = (outputPath) => {
  return path.resolve(outputPath, '..', 'webpack-stats.json')
}

export const writeStats = (outputPath, stats) => {
  const output = getStatsFile(outputPath)
  fs.mkdirSync(path.dirname(output), { recursive: true })
  fs.writeFileSync(output, JSON.stringify(stats))
}

export const startDevServer = (compiler, options = {}, log) => {

  const app = express()

  app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      return next();
  });

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: 'http://localhost:8001/static/',
      stats: 'error-only',
      watchOptions: {
        ignored: /^node_modules/,
        // stats: compiler.options.stats,
      },
      writeToDisk: true,
      logLevel: 'warn',
      reporter(middlewareOptions, options) {
        const { state, stats } = options
        if (state) {
          if (!stats.hasErrors()) {
            stats.toJson('normal').children.forEach(child => {
              writeStats(child.outputPath, child)
            })
          }
        }
        webpackDevMiddlewareReporter(middlewareOptions, options)
      }
    })
  )

  compiler.compilers.forEach(compiler => {

    if (options.withHMR) {
      app.use(
        webpackHotMiddleware(compiler, { log: log.extend('HMR') })
      )
    }

    app.use(
      compiler.options.output.publicPath,
      express.static(compiler.options.output.path)
    );

  })

  return new Promise(resolve => {
    const listener = app.listen(options.DEVPORT, () => {
      log(`DevServer listening on PORT ${listener.address().port}`);
      resolve()
    });
  })

}

if (!module.parent) {

  dotenv.config()
  debug.enable(process.env.DEBUG)

  const packageJson = JSON.parse(fs.readFileSync(path.resolve('package.json')))
  const options = packageJson.config[process.env.npm_lifecycle_event]

  start({
    log: debug('start'),
    ...options
  })
}
