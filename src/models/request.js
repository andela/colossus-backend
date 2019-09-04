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
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Open',
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
    Request.hasMany(models.Comment, {
      foreignKey: 'requestId',
      as: 'comments'
    });
    Request.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    Request.belongsTo(models.User, {
      foreignKey: 'lineManagerId',
      onDelete: 'SET NULL',
    });
  };
  return Request;
};
