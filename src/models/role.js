export default (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    name: DataTypes.STRING
  }, {});
  Role.associate = (models) => {
  // associations can be defined here
    Role.hasMany(models.Permission, {
      foreignKey: 'roleId',
      as: 'permissions', // alias
    });
    Role.hasMany(models.User, {
      foreignKey: 'roleId',
      as: 'users', // alias
    });
  };
  return Role;
};
