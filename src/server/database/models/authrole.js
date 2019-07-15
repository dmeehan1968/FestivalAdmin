module.exports = function(sequelize, DataTypes) {
  const AuthRole = sequelize.define('AuthRole', {
    // attributes
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
  }, {
    // options
  })

  AuthRole.associate = models => {
    AuthRole.belongsToMany(models['AuthUser'], { through: 'AuthUserAuthRole', as: { plural: 'authUsers' } })
    AuthRole.belongsToMany(models['AuthPerm'], { through: 'AuthRoleAuthPerm', as: { plural: 'perms' } })
  }

  AuthRole.graphql = {
  }

  return AuthRole
}
