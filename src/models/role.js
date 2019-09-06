export default (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    name: DataTypes.ENUM(
      'super_admin',
      'travel_admin',
      'travel_team_member',
      'manager',
      'requester',
      'supplier',
      'user'
    )
  }, {});
  Role.associate = (models) => {
  // associations can be defined here
    Role.hasMany(models.Permission, {
      foreignKey: 'role',
      sourceKey: 'name'
    });
    Role.hasMany(models.User, {
      foreignKey: 'role',
      sourceKey: 'name'
    });
  };
  return Role;
};
