export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Permissions', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    create: {
      type: Sequelize.BOOLEAN
    },
    read: {
      type: Sequelize.BOOLEAN
    },
    update: {
      type: Sequelize.BOOLEAN
    },
    delete: {
      type: Sequelize.BOOLEAN
    },
    roleId: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    resourceId: {
      allowNull: false,
      type: Sequelize.INTEGER
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
