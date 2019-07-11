module.exports = function(sequelize, DataTypes) {
  const AuthPerm = sequelize.define('AuthPerm', {
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

  AuthPerm.associate = models => {
    AuthPerm.belongsToMany(models['AuthRole'], { through: 'AuthRoleAuthPerm', as: { plural: 'authRoles' } })
  }

  AuthPerm.graphql = {
  }

  return AuthPerm
}
