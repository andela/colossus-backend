
export default (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
  }, {});

  // eslint-disable-next-line func-names
  Like.associate = function ({ User }) {
    // associations can be defined here
    const like = this;
    like.belongsTo(User, {
      foreignKey: 'likedBy',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  // eslint-disable-next-line func-names
  Like.countByAccommodation = function (accommodationId) {
    const like = this;
    return like.count({
      where: {
        accommodationId
      }
    });
  };
  return Like;
};
