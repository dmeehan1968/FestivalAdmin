const assert = require('assert')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

module.exports = function(sequelize, DataTypes) {
  const AuthUser = sequelize.define('AuthUser', {
    // attributes
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
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
    defaultScope: {
      attributes: {
        exclude: [ 'password' ],
      },
      include: [
        {
          association: 'roles',
          through: {
            attributes: [],
          },
          include: [
            {
              association: 'perms',
              through: {
                attributes: [],
              }
            }
          ]
        },
      ],
    },
    scopes: {
      withPassword: {
        attributes: {
          include: [ 'password' ],
        },
      },
    },
    hooks: {
      beforeValidate: (user, options) => {
        if (user.changed('email')) {
          user.email = user.email.trim()
        }

        if (user.changed('password')) {
          user.password = user.password.trim()
        }
      },
      beforeSave: (user, options) => {
        if (user.changed('password')) {
          return bcrypt.hash(user.password, 10).then(hash => user.password = hash)
        }
      },
      afterFind: (user) => {
        user.permissions = user.roles.reduce((acc, role) => {
          return {
            ...acc,
            ...role.perms.reduce((acc, perm) => {
              return {
                ...acc,
                [perm.name]: true,
              }
            }, {})
          }
        }, {})
      }
    },
    getterMethods: {
      avatar() {
        const hash = crypto.createHash('md5').update(this.email.toLowerCase()).digest('hex')
        return `https://www.gravatar.com/avatar/${hash}`
      },
    },
  })

  AuthUser.prototype.verifyPassword = function(password) {
    return bcrypt.compare(password, this.password)
  }

  AuthUser.prototype.hasRole = function(name) {
    return !!this.roles.find(role=>role.name===name)
  }

  AuthUser.prototype.hasPermission = function(name) {
    return !!this.permissions[name]
  }

  AuthUser.prototype.authToken = function() {

    const path = require('path')
    const fs = require('fs')
    const rsaPrivateKey = fs.readFileSync(path.resolve('.rsa'))

    return jwt.sign({
      id: this.id,
      avatar: this.avatar,
      roles: this.roles.reduce((acc, role)=>({ ...acc, [role.name]: true }),{}),
      permissions: this.permissions,
    },
    rsaPrivateKey,
    {
      algorithm: 'RS256',
      expiresIn: process.env.AUTH_EXPIRY || '1d',
    })
  }

  AuthUser.associate = models => {
    AuthUser.hasMany(models['Event'])
    AuthUser.belongsToMany(models['AuthRole'], { through: 'AuthUserAuthRole', as: { plural: 'roles' } })
  }

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

  AuthUser.login = (email, password) => {
    return AuthUser
    .scope('defaultScope', 'withPassword')
    .findOne({ where: { email }})
    .then(user => {
      return Promise.all([
        user,
        user && user.verifyPassword(password)
      ])
    })
    .then(([ user, valid ]) => {
      if (!valid) {
        throw new AuthenticationError('Unknown user or credentials mismatch')
      }
      return { token: user.authToken() }
    })
  }

  AuthUser.signup = (email, password, confirmPassword) => {

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
      throw error
    })
  }

  AuthUser.graphql = {
    excludeMutations: [ 'create', 'update', 'destroy' ],
    excludeQueries: [ 'query' ],
    types: {
      LoginInput: { email: 'string!', password: 'string!' },
      SignupInput: { email: 'string!', password: 'string!', confirmPassword: 'string!' },
      AuthSuccess: { token: 'string!' },
    },
    mutations: {
      login: {
        input: 'LoginInput!',
        output: 'AuthSuccess',
        resolver: (source, { LoginInput: { email, password }}, context, info, where) => AuthUser.login(email, password),
      },
      signup: {
        input: 'SignupInput!',
        output: 'AuthSuccess',
        resolver: (source, { SignupInput: { email, password, confirmPassword }}, context, info, where) => AuthUser.signup(email, password, confirmPassword),
      }
    }
  }

  return AuthUser
}
