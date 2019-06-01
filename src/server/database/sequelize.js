import Sequelize from 'sequelize'
import assert from 'assert'
import debug from 'debug'
import casual from 'casual'

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
    const contacts = Array(3).fill(undefined).map(() => {
      const contact = new Contact({
        firstName: casual.first_name,
        lastName: casual.last_name,
      })
      return contact.save()
    })
    return Promise.all(contacts)
  })
  .then(() => db)
  .catch(err => {
    log(`Database error: ${err.message}`)
    log(err.stack)
    throw err
  })
}
