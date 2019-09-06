export default (sequelize, DataTypes) => {
  const Permission = sequelize.define('Permission', {
    role: DataTypes.ENUM(
      'super_admin',
      'travel_admin',
      'travel_team_member',
      'manager',
      'requester',
      'supplier',
      'user'
    ),
    resource: DataTypes.STRING,
    create: DataTypes.BOOLEAN,
    read: DataTypes.BOOLEAN,
    update: DataTypes.BOOLEAN,
    delete: DataTypes.BOOLEAN
  }, {});
  return Permission;
};
