import { Sequelize, DataTypes } from 'sequelize';
import configuration from '../database/config/config';
// import User from './User';
// import InvalidToken from './InvalidToken';
// import Request from './request';
// import Trip from './trip';
const fs = require('fs');
const path = require('path');

const basename = path.basename(module.filename);

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
  .filter(file =>
    (file.indexOf('.') !== 0) &&
    (file !== basename) &&
    (file.slice(-3) === '.js'))
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  console.log(modelName);
  console.log(db)
  if (db[modelName].associate) {
    console.log('associating');
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;
// db.User = User(sequelize, DataTypes);
// db.InvalidToken = InvalidToken(sequelize, DataTypes);
// db.Request = Request(sequelize, DataTypes);
// db.Trip = Trip(sequelize, DataTypes);

export default db;
