import { genSaltSync, hashSync } from 'bcryptjs';

const UserDefinition = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'First name cannot be empty'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Last name cannot be empty'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Provide a valid email'
        },
        notEmpty: {
          msg: 'Email is required'
        }
      },
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password is required'
        }
      }
    },
    isVerified: {
      defaultValue: false,
      type: DataTypes.BOOLEAN
    },
    gender: {
      type: DataTypes.ENUM('male', 'female')
    },
    birthDate: {
      type: DataTypes.DATE
    },
    language: {
      type: DataTypes.STRING,
      defaultValue: 'EN'
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'NGN'
    },
    address: {
      type: DataTypes.STRING
    },
    department: {
      type: DataTypes.STRING
    },
    picture: {
      type: DataTypes.JSON
    },
    role: {
      type: DataTypes.ENUM(
        'super_admin',
        'travel_admin',
        'travel_team_member',
        'manager',
        'requester',
        'supplier',
        'user'
      ),
      defaultValue: 'user',
    },
    emailNotify: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    appNotify: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    hooks: {
      beforeSave: (user) => {
        if (user.changed('password')) {
          const salt = genSaltSync(10);
          user.password = hashSync(user.password, salt);
        }
      }
    },
    timestamps: true
  });
  // eslint-disable-next-line func-names
  User.findByEmail = function (email) {
    const user = this;
    return user.findOne({
      where: {
        email
      }
    });
  };

  // eslint-disable-next-line func-names
  User.findByIdAndEdit = function (id, update) {
    const user = this;
    return user.update(update, {
      where: {
        id
      },
      individualHooks: true
    });
  };

  // eslint-disable-next-line func-names
  User.associate = function (models) {
    // Associations can be defined here
    const user = this;
    user.belongsTo(models.User, {
      foreignKey: 'lineManagerId', // changed from lineManager to lineManagerId
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
    user.hasMany(models.Request, {
      foreignKey: 'userId',
      as: 'requests'
    });
    User.belongsTo(models.Role, {
      targetKey: 'name',
      foreignKey: 'role'
    });
  };
  return User;
};

export default UserDefinition;
