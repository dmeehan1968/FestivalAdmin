export default (sequelize, DataTypes) => {
  const Event = sequelize.define('event', {
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
    // modelName: 'Event',
  })

  Event.associate = models => {
    // Event.belongsToMany(models['contact'], { through: 'contactEvents'})
  }

  return Event
}
