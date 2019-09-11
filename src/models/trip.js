export default (sequelize, DataTypes) => {
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
      allowNull: true,
    },
    accommodation: {
      type: DataTypes.STRING,
      allowNull: true,
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
