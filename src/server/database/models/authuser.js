const assert = require('assert')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = function(sequelize, DataTypes) {
  const AuthUser = sequelize.define('AuthUser', {
    // attributes
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  }, {
    // options
    initialAutoIncrement: 1,
    sequelize: sequelize,
    name: {
      singular: 'authuser',
      plural: 'authusers',
    },
    tableName: 'authusers',
    modelName: 'AuthUser',
    hooks: {
      beforeSave: (user, options) => {
        if (user.changed('password')) {
          return bcrypt.hash(user.password, 10).then(hash => user.password = hash)
        }
      },
    },
  })

  AuthUser.prototype.comparePassword = function(password) {
    return bcrypt.compare(password, this.password)
  }

  AuthUser.prototype.authToken = function() {
    const secret = process.env.AUTH_SECRET

    assert(secret, 'AUTH_SECRET not in env')

    return jwt.sign({
      id: this.id,
    },
    secret)
  }

  // AuthUser.associate = models => {
  //   AuthUser.belongsToMany(models['Event'], { through: 'contactEvents'})
  // }

  class AuthenticationError extends Error {
    constructor(message, errors) {
      super(message)
      this.name = 'AuthenticationError'
      this.message = message || 'Authentication Error'
      this.errors = errors || []
      if (this.errors.length > 1 && this.errors[0].message) {
        this.message = this.errors.map(err => `${err.type || err.origin}: ${err.message}`).join(',\n')
      }
      Error.captureStackTrace(this, this.constructor)
    }
  }

  const handleLogin = (email, password) => {
    return AuthUser
    .findOne({ where: { email }})
    .then(user => {
      return Promise.all([
        user,
        user && user.comparePassword(password)
      ])
    })
    .then(([ user, valid ]) => {
      if (!valid) {
        throw new AuthenticationError('Unknown user or credentials mismatch')
      }
      return { token: user.authToken() }
    })
  }

  const handleSignup = (email, password, confirmPassword) => {

    return Promise.resolve()
    .then(() => {
      if (password !== confirmPassword) {
        throw new AuthenticationError('Password mismatch in signup')
      }
    })
    .then(() => AuthUser.create({ email, password }))
    .then(user => {
      return { token: user.authToken() }
    })
    .catch(error => {
      if (error.parent && error.parent.code === 'ER_DUP_ENTRY') {
        throw new AuthenticationError('Email already registered')
      }
      throw error // new AuthenticationError(error.message, error.errors)
    })
  }

  AuthUser.graphql = {
    excludeMutations: [ 'create', 'update', 'destroy' ],
    excludeQueries: [ 'query' ],
    types: {
      CredentialsInput: { email: 'string!', password: 'string!', confirmPassword: 'string' },
      Success: { token: 'string!' },
    },
    mutations: {
      login: {
        input: 'CredentialsInput!',
        output: 'Success',
        resolver: (source, args, context, info, where) => {
          const { CredentialsInput: { email, password } } = args
          return handleLogin(email, password)
        },
      },
      signup: {
        input: 'CredentialsInput!',
        output: 'Success',
        resolver: (source, args, context, info, where) => {
          const { CredentialsInput: { email, password, confirmPassword } } = args
          return handleSignup(email, password, confirmPassword)
        },
      }
    }
  }

  return AuthUser
}
