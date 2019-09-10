
export default (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  });

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

  // eslint-disable-next-line func-names
  Like.deleteByUserAndAccommodation = function (likedBy, accommodationId) {
    const like = this;
    return like.destroy({
      where: {
        likedBy,
        accommodationId
      }
    });
  };

  // eslint-disable-next-line func-names
  Like.findByUserAndAccommodation = function (likedBy, accommodationId) {
    const like = this;
    return like.findOne({
      where: {
        likedBy,
        accommodationId
      }
    });
  };
  return Like;
};
