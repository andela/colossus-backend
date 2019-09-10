export default (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    type: {
      allowNull: false,
      type: DataTypes.STRING
    },
    booked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {});

  Room.associate = (models) => {
    // associations can be defined here
    Room.belongsTo(models.Accommodation, {
      foreignKey: 'accommodationId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Room.belongsTo(models.User, {
      foreignKey: 'bookedBy',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  };

  Room.book = (id, bookedBy) => Room.update({
    bookedBy,
    booked: true
  }, {
    where: {
      id
    },
    returning: true
  });

  Room.rescind = (id, bookedBy) => Room.update({
    bookedBy: null,
    booked: false
  }, {
    where: {
      id,
      bookedBy
    },
    returning: true
  });
  return Room;
};
