
const AccommodationDefinition = (sequelize, DataTypes) => {
  const Accommodation = sequelize.define('Accommodation', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
    },
    owner: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {});
  Accommodation.associate = (models) => {
    // associations can be defined here
    Accommodation.hasMany(models.Room, {
      foreignKey: 'accomodation',
      as: 'rooms'
    });
  };

  // eslint-disable-next-line func-names
  Accommodation.associate = function (models) {
    // associations can be defined here
    const accommodation = this;
    accommodation.belongsTo(models.User, {
      foreignKey: 'bookedBy',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
    accommodation.belongsTo(models.User, {
      foreignKey: 'startedBy',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  };

  // eslint-disable-next-line func-names
  Accommodation.book = function (id, bookedBy, movingIn, movingOut) {
    const accommodation = this;
    return accommodation.update({
      bookedBy,
      movingIn,
      movingOut,
      booked: true
    }, {
      where: {
        id
      }
    });
  };

  // eslint-disable-next-line func-names
  Accommodation.findWhereBookedBy = function (bookedBy) {
    const accommodation = this;
    return accommodation.findOne({
      where: {
        bookedBy
      }
    });
  };

  // eslint-disable-next-line func-names
  Accommodation.findWhereStartedBy = function (startedBy) {
    const accommodation = this;
    return accommodation.find({
      where: {
        startedBy
      }
    });
  };

  // eslint-disable-next-line func-names
  Accommodation.rescind = function (bookedBy) {
    const accommodation = this;
    return accommodation.update({
      bookedBy: null,
      movingIn: null,
      movingOut: null,
      booked: false
    }, {
      where: {
        bookedBy
      }
    });
  };
  return Accommodation;
};

export default AccommodationDefinition;
