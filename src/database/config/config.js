import dotenv from 'dotenv';

dotenv.config();

module.exports = {
  development: {
    use_env_variable: 'DATABASE_DEV',
    url: process.env.DATABASE_DEV,
    dialect: 'postgres',
    define: {
      underscored: true
    }
  },
  production: {
    use_env_variable: 'DATABASE_PROD',
    url: process.env.DATABASE_PROD,
    dialect: 'postgres',
    define: {
      underscored: true
    }
  },
  test: {
    use_env_variable: 'DATABASE_DEV',
    url: process.env.DATABASE_DEV,
    dialect: 'postgres',
    define: {
      underscored: true
    }
  }
};
