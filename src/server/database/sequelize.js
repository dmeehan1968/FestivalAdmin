import Sequelize from 'sequelize'
import assert from 'assert'
import debug from 'debug'
const log = debug('app:database')
const logMysql = debug('app:database:mysql')

export default (options = {}) => {

  const defaults = {
    dialect: 'mysql',
    logging: false,
    timezone: '+00:00',
  }

  options = Object.assign({}, defaults, options)

  assert(options.schema)
  assert(options.user)
  assert(options.password)
  assert(options.host)

  const db = new Sequelize(
    options.schema,
    options.user,
    options.password,
    {
      host: options.host,
      dialect: options.dialect,
      logging: options.logging ? logMysql : false,
      timezone: options.timezone,
    }
  )

  log(`Connecting to ${options.schema} @ ${options.host}...`)

  return db.authenticate().then(() => {
    log('connected')
  })
  .then(() => {
    db.import('./models/contact')
  })
  .then(() => {
    return db.sync({
      force: true       // drop exising tables
    })
  })
  .then(() => {
    // seed
    const Contact = db.models['contact']
    const dave = Contact.build({ id: 0, firstName: 'Dave', lastName: 'Meehan' })
    return dave.save()
  })
  .then(() => db)
  .catch(err => {
    log(`Database error: ${err.message}`)
    log(err.stack)
    throw err
  })
}
