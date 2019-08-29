export default (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    passportName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    managerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {});
  Request.associate = (models) => {
    // associations can be defined here
    Request.hasMany(models.Trip, {
      foreignKey: 'requestId',
      as: 'trips'
    });
    Request.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };
  return Request;
};
