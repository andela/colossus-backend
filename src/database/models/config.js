import db, { UserDefinition, InvalidTokenDefinition } from '../../models';

const { sequelize, DataTypes } = db;

const User = UserDefinition(sequelize, DataTypes);
const InvalidToken = InvalidTokenDefinition(sequelize, DataTypes);

export {
  User,
  InvalidToken
};
