
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Accommodation', {
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
    image: {
      type: Sequelize.STRING
    },
    location: {
      allowNull: false,
      type: Sequelize.STRING
    },
    owner: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    totalNumberOfRooms: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT
    },
    cost: {
      type: Sequelize.TEXT
    },
    addOn: {
      type: Sequelize.TEXT
    },
    amenities: {
      type: Sequelize.ARRAY(Sequelize.TEXT)
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
    bookedBy: {
      type: Sequelize.INTEGER,
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    startedBy: {
      type: Sequelize.INTEGER,
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id'
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
  down: (queryInterface) => queryInterface.dropTable('Accommodation')
};
