
export default (sequelize, DataTypes) => {
  const AccommodationFeedback = sequelize.define('AccommodationFeedback', {
    feedbackBody: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    paranoid: true
  });

  AccommodationFeedback.associate = (models) => {
    AccommodationFeedback.belongsTo(models.Accommodation, {
      foreignKey: 'accommodationId',
      onDelete: 'CASCADE',
    });
    AccommodationFeedback.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };

  return AccommodationFeedback;
};
