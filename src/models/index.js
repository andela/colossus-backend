import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import configuration from '../database/config/config';

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
db.DataTypes = DataTypes;

export { UserDefinition } from './User';
export { InvalidTokenDefinition } from './InvalidToken';
export default db;
