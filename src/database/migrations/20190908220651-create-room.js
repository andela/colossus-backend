export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Rooms', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING
    },
    type: {
      allowNull: false,
      type: Sequelize.STRING
    },
    accommodationId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'Accommodation',
        key: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }
    },
    booked: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    bookedBy: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
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
  down: (queryInterface) => queryInterface.dropTable('Rooms')
};
