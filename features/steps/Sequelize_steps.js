import { Given, When, Then } from 'cucumber'
import path from 'path'
import expect from 'expect'

const sequelize = {
  define(name, fields, options) {
    return {
      prototype: {}
    }
  },
  DataTypes: {
    INTEGER(size) {
      return {
        UNSIGNED: undefined,
      }
    },
    STRING(size) {
    },
  }
}

Given('the Sequelize model {word}', function(model) {
  this.model = require(path.resolve('./src/server/database/models', model.toLowerCase()))(sequelize, sequelize.DataTypes)
})
