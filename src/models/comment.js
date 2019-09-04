export default (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    commentBody: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {});

  Comment.associate = (models) => {
    Comment.belongsTo(models.Request, {
      foreignKey: 'requestId',
      onDelete: 'CASCADE',
    });
  };

  return Comment;
};
