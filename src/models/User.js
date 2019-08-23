import { genSaltSync, hashSync } from 'bcryptjs';

const newUser = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
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
      }
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
    }
  },
  {
    hooks: {
      beforeSave: (user) => {
        // Hash password before saving
        if (user.changed('password')) {
          const salt = genSaltSync(10);
          user.password = hashSync(user.password, salt);
        }
      }
    }
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
  return User;
};

export default newUser;
