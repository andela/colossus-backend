export default (sequelize, DataTypes) => {
  const Resource = sequelize.define('Resource', {
    name: DataTypes.STRING
  }, {});
  Resource.associate = (models) => {
  // associations can be defined here
    Resource.hasMany(models.permission, {
      foreignKey: 'resourceId',
      as: 'permissions', // alias
    });
  };
  return Resource;
};
