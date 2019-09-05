module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    isVerified: {
      type: Sequelize.BOOLEAN
    },
    gender: {
      type: Sequelize.ENUM('male', 'female')
    },
    birthDate: {
      type: Sequelize.DATE
    },
    language: {
      type: Sequelize.STRING,
      defaultValue: 'EN'
    },
    currency: {
      type: Sequelize.STRING,
      defaultValue: 'NGN'
    },
    address: {
      type: Sequelize.STRING
    },
    role: {
      type: Sequelize.ENUM(
        'super_admin',
        'travel_admin',
        'travel_team_member',
        'manager',
        'requester',
        'supplier',
        'user'
      ),
      defaultValue: 'user'
      // validate: {
      //   isIn: {
      //     args: [[
      //       'super_admin',
      //       'travel_admin',
      //       'travel_team_member',
      //       'manager',
      //       'requester',
      //       'supplier',
      //       'user'
      //     ]],
      //     msg: 'Invalid role'
      // }
      // }
    },
    department: {
      type: Sequelize.STRING
    },
    picture: {
      type: Sequelize.JSON
    },
    lineManagerId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
        as: 'lineManagerId',
      }
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: (queryInterface) => queryInterface.dropTable('Users')
};
