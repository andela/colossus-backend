import { Sequelize, DataTypes } from 'sequelize';
import configuration from '../database/config/config';
import User from './User';
import InvalidToken from './InvalidToken';

const env = process.env.NODE_ENV || 'development';
const config = configuration[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = User(sequelize, DataTypes);
db.InvalidToken = InvalidToken(sequelize, DataTypes);

export default db;
