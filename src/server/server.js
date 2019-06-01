import dotenv from 'dotenv'

import httpServer from './httpServer'
import database from './database'

export default () => {

  dotenv.config()

  let port = Number(process.env.PORT)
  port = isNaN(port) ? undefined : port

  database({
    host: process.env.DB_HOST,
    schema: process.env.DB_SCHEMA,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    timezone: process.env.DB_TIMEZONE,
    dialect: process.env.DB_DIALECT,
    logging: true,
  })
    .then(db => httpServer({ port, db }))
    .then(address => {
      console.log(`Server running on ${address.port}`);
    })
    .catch(() => console.error('Failed'))
}
