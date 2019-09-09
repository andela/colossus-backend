export default (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    type: {
      allowNull: false,
      type: DataTypes.STRING
    },
    accommodationId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
  }, {});

  Room.associate = (models) => {
    // associations can be defined here
    Room.belongsTo(models.Accommodation, {
      foreignKey: 'accommodationId'
    });
  };
  return Room;
};
