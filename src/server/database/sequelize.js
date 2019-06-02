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
    db.import('./models/event')
  })
  .then(() => {
    Object.keys(db.models).forEach(key => {
      if (typeof db.models[key].associate === 'function') {
        db.models[key].associate(db.models)
      }
    })
  })
  .then(() => {
    return db.sync({
      force: true       // drop exising tables
    })
  })
  .then(() => {
    // seed
    const { contact: Contact, event: Event } = db.models
    return db.transaction(t => {
      const contacts = Array(10).fill(undefined).map(() => {
        return Contact.create({
          firstName: casual.first_name,
          lastName: casual.last_name,
        }, { transaction: t }).then(contact => {
          const event = Event.build({
            title: casual.title,
          })
          return contact.setEvent(event, { transaction: t })
        })
      })
      return Promise.all(contacts)
    })
  })
  .then(() => {
    return ({
      ...db.models,
      sequelize: db,
      Sequelize: Sequelize,
    })
  })
  .catch(err => {
    log(err.stack)
    throw err
  })
}
