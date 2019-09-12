export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Ratings', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    accommodationId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'Accommodation',
        key: 'id',
        as: 'accommodationId',
      },
    },
    averageRating: {
      type: Sequelize.DOUBLE,
      defaultValue: 0,
    },
    numberOfRatings: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
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
  down: (queryInterface) => queryInterface.dropTable('Ratings')
};
