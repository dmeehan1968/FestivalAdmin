import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {
  class Contact extends Model {}
  Contact.init({
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
    sequelize: sequelize,
    name: {
      singular: 'contact',
      plural: 'contacts',
    },
    tableName: 'contacts',
    modelName: 'Contact',
  })

  Contact.associate = models => {
    Contact.belongsToMany(models['Event'], { through: 'contactEvents'})
  }

  return Contact
}
