module.exports = function(sequelize, DataTypes) {
  const Event = sequelize.define('Event', {
    // attributes
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  }, {
    // options
    initialAutoIncrement: 1,
    sequelize: sequelize,
    name: {
      singular: 'event',
      plural: 'events',
    },
    tableName: 'events',
    // modelName: 'Event',
  })

  Event.associate = models => {
    Event.belongsToMany(models['Contact'], { through: 'contactEvents' })
  }

  return Event
}
