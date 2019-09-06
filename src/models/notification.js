const newNotification = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'notification type cannot be empty'
        }
      }
    },
    receiver: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        notEmpty: {
          msg: 'notification receiver cannot be empty'
        }
      }
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'notification content cannot be empty'
        }
      }
    },
    isRead: {
      defaultValue: false,
      type: DataTypes.BOOLEAN
    }
  });
  return Notification;
};

export default newNotification;
