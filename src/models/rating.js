
export default (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    averageRating: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    numberOfRatings: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    }
  }, {});
  Rating.associate = (models) => {
    // associations can be defined here
    Rating.belongsTo(models.Accommodation, {
      foreignKey: 'accommodationId',
      onDelete: 'CASCADE',
    });
  };
  return Rating;
};