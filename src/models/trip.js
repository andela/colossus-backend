const newTrip = (sequelize, DataTypes) => {
  const Trip = sequelize.define('Trip', {
    from: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    to: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    departureDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    arrivalDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    accommodation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {});
  Trip.associate = (models) => {
    // associations can be defined here
    Trip.belongsTo(models.Request, {
      foreignKey: 'requestId',
      onDelete: 'CASCADE',
    });
  };
  return Trip;
};

export default newTrip;
