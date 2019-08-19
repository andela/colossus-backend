// Model for tokens that are rendered invalid on logging out
export const InvalidToken = (sequelize, DataTypes) => {
  const token = sequelize.define('InvalidToken', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    actual: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Actual token required'
        }
      }
    }
  });
  token.findByActual = function (actual) {
    const Token = this;
    return Token.findOne({
      where: {
        actual
      }
    });
  };
  return token;
};
