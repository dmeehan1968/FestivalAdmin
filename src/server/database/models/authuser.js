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
      allowNull: true,
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
  })

  // AuthUser.associate = models => {
  //   AuthUser.belongsToMany(models['Event'], { through: 'contactEvents'})
  // }
  
  AuthUser.graphql = {
    excludeMutations: [ 'create', 'update', 'destroy' ],
    excludeQueries: [ 'fetch' ],
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
          return AuthUser
          .findOne({ where: { email }})
          .then(user => {
            // TODO: compare bcrypt passwords
            return {
              user,
              valid: user && true, //bcrypt.compare(user.password, password)
            }
          })
          .then(({ user, valid }) => {
            if (!valid) {
              throw new Error('Authentication Failure')
            }
            // TODO: generate token from user field (and permissions)
            // const token = jwt.sign({ id: user.id /*...*/ }, process.env.AUTH_SECRET)
            return { token: 'dummytoken' }
          })
        },
      },
      signup: {
        input: 'CredentialsInput!',
        output: 'Success',
        resolver: () => ({ token: 'dummytoken' }),
      }
    }
  }

  return AuthUser
}
