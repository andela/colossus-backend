export default (sequelize, DataTypes) => {
    const Chat = sequelize.define('Chat', {
      message: DataTypes.STRING
    }, {});
    Chat.associate = (models) => {
      // associations can be defined here
      Chat.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        as: 'user'
      });
    };
    return Chat;
  };