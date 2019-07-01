import Sequelize from 'sequelize'
import assert from 'assert'
import debug from 'debug'
import casual from 'casual'
import path from 'path'

export default (options = {}, log = debug('sequelize')) => {

  const logMysql = log.extend('mysql')

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
    db.import(path.resolve(process.cwd(), 'src/server/database/models/contact'))
    db.import(path.resolve(process.cwd(), 'src/server/database/models/event'))
    db.import(path.resolve(process.cwd(), 'src/server/database/models/authuser'))
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
    const { Contact, Event, AuthUser } = db.models
    return db.transaction(t => {
      const authusers = [
        AuthUser.create({ email: 'dave@dave.com', password: 'password' }, {
          transaction: t,
        }),
      ]
      const contacts = Array(5).fill(undefined).map(() => {
        return Contact.create({
          firstName: casual.first_name,
          lastName: casual.last_name,
          address1: [ casual.building_number, casual.street ].join(' '),
          city: casual.city,
          state: casual.state,
          postcode: casual.zip(),
          events: [
            {
              title: casual.title.slice(0,255),
              subtitle: casual.title.slice(0,255),
              description: casual.short_description.slice(0,255),
              longDescription: casual.description.slice(0,255),
            },
          ]
        }, {
          transaction: t,
          include: [ Event ],
        })
      })
      return Promise.all([ ...authusers, ...contacts ])
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
