"use strict";

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

module.exports = {
  development: {
    use_env_variable: 'DATABASE_DEV',
    url: process.env.DATABASE_DEV,
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'DATABASE_PROD',
    url: process.env.DATABASE_PROD,
    dialect: 'postgres'
  }
};