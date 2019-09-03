
const AccommodationDefinition = (sequelize, DataTypes) => {
  const Accommodation = sequelize.define('Accommodation', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING
    },
    movingIn: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
    movingOut: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
    booked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    picture: {
      type: DataTypes.JSON
    }
  }, {
    timestamps: true
  });

  // eslint-disable-next-line func-names
  Accommodation.associate = function (models) {
    // associations can be defined here
    const accommodation = this;
    accommodation.belongsTo(models.User, {
      foreignKey: 'bookedBy',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  };
  return Accommodation;
};

export default AccommodationDefinition;
