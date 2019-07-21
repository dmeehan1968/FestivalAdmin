import React from 'react'
import { Given, When, Then } from 'cucumber'
import path from 'path'
// import { shallow } from 'enzyme'
import expect from 'expect'

const sequelize = {
  define(name, fields, options) {
    return {
      prototype: {}
    }
  }
}

const DataTypes = {
  INTEGER(size) {
    return {
      UNSIGNED: undefined,
    }
  },
  STRING(size) {
  },
}

Given('the {word} model', function(model) {
  this.model = require(path.resolve('./src/server/database/models', model.toLowerCase()))(sequelize, DataTypes)
})

Then('there is a GraphQL {word} type with fields', function (type, data) {
  const typedef = this.model.graphql.types[type]
  expect(typedef).toEqual(data.hashes().reduce((acc, row) => {
    return { ...acc, [row.field]: row.type }
  }, {}))
})

Then('there is a {word} mutation that accepts {word} and returns {word}', function(name, input, output) {
  const mutation = this.model.graphql.mutations[name]
  expect(mutation.input).toEqual(input)
  expect(mutation.output).toEqual(output)
})
