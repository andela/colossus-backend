import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import { User, InvalidToken } from '../models';

dotenv.config();

const sequelize = new Sequelize({
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  define: {
    underscored: true
  },
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  dialect: 'postgres'
});

const UserModel = User(sequelize, Sequelize);
const InvalidTokenModel = InvalidToken(sequelize, Sequelize);

export {
  UserModel,
  InvalidTokenModel,
  sequelize
};
