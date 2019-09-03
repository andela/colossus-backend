export default (sequelize, DataTypes) => {
  const Permission = sequelize.define('Permission', {
    create: DataTypes.BOOLEAN,
    read: DataTypes.BOOLEAN,
    update: DataTypes.BOOLEAN,
    delete: DataTypes.BOOLEAN,
    roleId: DataTypes.INTEGER,
    resourceId: DataTypes.INTEGER
  }, {});
  return Permission;
};
