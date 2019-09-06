
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
    accommodation.belongsTo(models.User, {
      foreignKey: 'startedBy',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
    accommodation.hasMany(models.Like, {
      foreignKey: 'accommodationId',
      as: 'likes'
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
  Accommodation.rescind = function (bookedBy, id) {
    const accommodation = this;
    return accommodation.update({
      bookedBy: null,
      movingIn: null,
      movingOut: null,
      booked: false
    }, {
      where: {
        bookedBy,
        id
      }
    });
  };
  return Accommodation;
};

export default AccommodationDefinition;
