import Sequelize from 'sequelize'
import assert from 'assert'
import debug from 'debug'
import casual from 'casual'
import path from 'path'
import * as models from './models'

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
    Object.keys(models).forEach(modelName => {
      models[modelName](db, Sequelize.DataTypes)
    })
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
    const { Contact, Event, AuthUser, AuthRole, AuthPerm } = db.models

    return db.transaction(transaction => {

      const perms = [
        { name: 'CreateEvents' },
        { name: 'ReadEvents' },
        { name: 'UpdateEvents' },
        { name: 'DeleteEvents' },
        { name: 'CreateOwnEvents' },
        { name: 'ReadOwnEvents' },
        { name: 'UpdateOwnEvents' },
        { name: 'DeleteOwnEvents' },
        { name: 'AuthPermissionRead' },
      ]

      return AuthPerm.bulkCreate(perms, { transaction })
      .then(perms => ({
        transaction,
        perms: perms.reduce((acc, perm) => ({ ...acc, [perm.name]: perm }), {})
      }))
      .then(({transaction, perms}) => {

        return Promise.all([
          {
            name: 'Admin',
            afterHook: role => role.addPerms(Object.values(perms), { transaction })
          },
          {
            name: 'Organiser',
            afterHook: role => role.addPerms([
              perms.CreateOwnEvents,
              perms.ReadOwnEvents,
              perms.UpdateOwnEvents,
              perms.DeleteOwnEvents,
            ], { transaction })
          },
        ].map(({ afterHook = (() => {}), ...role}) => {
          return AuthRole.create(role, { transaction })
          .then(role => afterHook(role).then(() => role))
        }))
        .then(roles => ({ transaction, roles }))

      })
      .then(({transaction, roles}) => {
        return {
          transaction,
          roles: roles.reduce((acc, role) => ({ ...acc, [role.name]: role }), {})
        }
      })
      .then(({transaction, roles}) => {

        const users = [
          {
            id: 1,
            email: 'dave_meehan@replicated.co.uk',
            password: 'Password1!',
            afterHook: user => user.setRoles([roles.Admin], { transaction }),
          },
          {
            id: 2,
            email: 'dave@example.com',
            password: 'Password1!',
            afterHook: user => user.setRoles([roles.Organiser], { transaction }),
          },
          {
            id: 3,
            email: 'ben@example.com',
            password: 'Password1!',
            afterHook: user => user.setRoles([roles.Organiser], { transaction }),
          },
        ]

        const getRandomBetween = (min, max) => {
          return Math.random() * (max - min) + min
        }

        const all = users.map(({ afterHook = (() => {}), ...user }) => {
          return AuthUser.create({
            ...user,
            events: Array(Math.round(getRandomBetween(1,5))).fill(undefined).map(() => ({
              AuthUserId: user.id,
              title: casual.title.slice(0,255),
              subtitle: casual.title.slice(0,255),
              description: casual.short_description.slice(0,255),
              longDescription: casual.description.slice(0,255),
            })),
          }, {
            transaction: transaction,
            include: [ Event ]
          })
          .then(afterHook)
        })

        return Promise.all(all)
      })
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
