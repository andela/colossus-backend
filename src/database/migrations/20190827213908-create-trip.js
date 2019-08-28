module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Trips', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    requestId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Requests',
        key: 'id',
        as: 'requestId',
      },
    },
    from: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    to: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    departureDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    arrivalDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    accommodation: {
      type: Sequelize.STRING,
      allowNull: false,
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
  down: (queryInterface) => queryInterface.dropTable('Trips')
};
