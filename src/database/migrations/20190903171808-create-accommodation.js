
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Accommodation', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    type: {
      type: Sequelize.STRING
    },
    movingIn: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null
    },
    movingOut: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null
    },
    booked: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    picture: {
      type: Sequelize.JSON
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
  down: (queryInterface) => queryInterface.dropTable('Accommodation')
};
