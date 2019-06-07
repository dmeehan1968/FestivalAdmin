import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {
  class Contact extends Model {}
  Contact.init({
    // attributes
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address1: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    address2: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    postcode: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
