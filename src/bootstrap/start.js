import webpack from 'webpack'
import fs from 'fs'
import path from 'path'
import nodemon from 'nodemon'
import express from 'express'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackDevMiddlewareReporter from 'webpack-dev-middleware/lib/reporter'
import debug from 'debug'

export const build = (options = {}) => {

  const defaults = {
    mode: process.env.NODE_ENV,
    PORT: process.env.PORT,
    withDevServer: false,
    withHMR: false,
    log: () => {},
    configs: [],
  }

  options = Object.assign({}, defaults, options)

  const {
    mode,
    withDevServer,
    withHMR,
    log,
  } = options

  let {
    PORT,
    configs,
  } = options

  PORT = isNaN(Number(PORT)) && 8000 || Number(PORT)

  log('Loading configs...');
  configs = configs.map(config => {
    return {
      ...config,
      webpack: require(path.resolve(process.cwd(), 'config', 'webpack', config.config)).default({ withHMR, PORT }).toConfig()
    }
  })

  log('Creating compilers...');
  const webpackRoot = webpack(configs.map(config => config.webpack))

  // log(JSON.stringify(configs, undefined, 2));

  const clientCompilers = webpackRoot.compilers.filter(compiler => compiler.name && compiler.name.match(/^client/))
  const serverCompilers = webpackRoot.compilers.filter(compiler => compiler.name && compiler.name.match(/^server/))

  log(`${clientCompilers.length} clients, ${serverCompilers.length} servers`)

  if (withDevServer) {
    startDevServers(clientCompilers, PORT+1000, withHMR, log)
  }

  Promise.all(startCompilation([
    ...(withDevServer && [] || clientCompilers),
    ...serverCompilers
  ], log))
  .then(compilers => {
    log(`Compiled ${compilers.length} configurations`)

    if (!withDevServer) {
      process.exit()
    }

    compilers.forEach((compiler, index) => {
      const script = nodemon({
        script: path.resolve(compiler.options.output.path, compiler.options.output.filename),
        watch: [
          compiler.options.output.path,
          path.resolve(process.cwd(), '.env'),
        ],
        // ignore: [
        //   path.resolve(process.cwd(), 'build/stats'),
        // ],
        env: {
          DEBUG: 'app:*,-app:database:mysql',
          PORT: PORT+index,
        },
      });

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

    })
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

export const startDevServers = (compilers, basePort, withHMR, log) => {

  compilers.forEach((compiler, index) => {

    if (withHMR) {
      compiler.options.entry.bundle = compiler.options.entry.bundle.map(entry => {
        return entry
          .replace(/{HOST}/g, 'http://localhost')
          .replace(/{PORT}/g, basePort+index)
      })
    }

    const app = express()

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        return next();
    });

    app.use(
      webpackDevMiddleware(compiler, {
        publicPath: compiler.options.output.publicPath,
        stats: compiler.options.stats,
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
              writeStats(
                path.resolve(compiler.options.output.path, '..', 'webpack-stats.json'),
                stats,
                compiler.options.stats)
            }
          }
          webpackDevMiddlewareReporter(middlewareOptions, options)
        }
      })
    )

    if (withHMR) {
      app.use(
        webpackHotMiddleware(compiler, { log: false })
      )
    }

    app.use(
      compiler.options.output.publicPath,
      express.static(compiler.options.output.path)
    );

    const listener = app.listen(basePort+index, () => {
      log(`DevServer listening on PORT ${listener.address().port}`);
    });

  })

}


import dotenv from 'dotenv'

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
