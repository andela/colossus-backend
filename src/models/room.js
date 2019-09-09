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
  }, {});
  return Room;
};
