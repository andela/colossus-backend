import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import configuration from '../database/config/config';
// import User from './User';
// import InvalidToken from './InvalidToken';
// import resource from './resource';
// import permission from './permission';

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = configuration[env];
const db = {};
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}
fs
  .readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
// db.User = User(sequelize, DataTypes);
// db.InvalidToken = InvalidToken(sequelize, DataTypes);
// db.resource = resource(sequelize, DataTypes);
// db.permission = permission(sequelize, DataTypes);

export default db;
