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
      validate: {
        notEmpty: true,
        len: [ 5, 255 ],
      },
    },
    subtitle: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
    longDescription: {
      type: DataTypes.STRING(255),
      allowNull: true,
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

  // Event.graphql = {
  //   alias: {
  //     fetch: 'events',
  //   },
  // }
  //
  return Event
}
