module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Comments', 'deletedAt',
    {
      type: Sequelize.DATE,
      allowNull: true
    }
  ),

  down: (queryInterface) => queryInterface.removeColumn('Comments', 'deletedAt')
};
