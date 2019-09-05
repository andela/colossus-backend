export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Permissions', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    role: {
      allowNull: false,
      type: Sequelize.ENUM(
        'super_admin',
        'travel_admin',
        'travel_team_member',
        'manager',
        'requester',
        'supplier',
        'user'
      )
    },
    resource: {
      allowNull: false,
      type: Sequelize.STRING
    },
    create: {
      allowNull: true,
      type: Sequelize.BOOLEAN
    },
    read: {
      allowNull: true,
      type: Sequelize.BOOLEAN
    },
    update: {
      allowNull: true,
      type: Sequelize.BOOLEAN
    },
    delete: {
      allowNull: true,
      type: Sequelize.BOOLEAN
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
  down: (queryInterface) => queryInterface.dropTable('Permissions')
};
