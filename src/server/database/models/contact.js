export default (sequelize, DataTypes) => {
  const Contact = sequelize.define('contact', {
    // attributes
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  }, {
    // options
    initialAutoIncrement: 1,
  })

  Contact.associate = models => {
    Contact.belongsToMany(models['event'], { through: 'contactEvents'})
  }

  return Contact
}
