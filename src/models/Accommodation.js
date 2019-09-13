
const AccommodationDefinition = (sequelize, DataTypes) => {
  const Accommodation = sequelize.define('Accommodation', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
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
      type: DataTypes.INTEGER
    },
    totalNumberOfRooms: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    cost: {
      type: DataTypes.TEXT
    },
    addOn: {
      type: DataTypes.TEXT
    },
    amenities: {
      type: DataTypes.ARRAY(DataTypes.TEXT)
    },
  }, {});

  Accommodation.associate = (models) => {
    // associations can be defined here
    Accommodation.hasMany(models.Room, {
      foreignKey: 'accommodationId',
      as: 'rooms',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Accommodation.belongsTo(models.User, {
      foreignKey: 'owner',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Accommodation.hasMany(models.Like, {
      foreignKey: 'accommodationId',
      as: 'likes'
    });
  };

  // eslint-disable-next-line func-names
  Accommodation.findWhereOwner = (owner) => Accommodation.findAll({
    where: {
      owner
    }
  });
  return Accommodation;
};

export default AccommodationDefinition;
