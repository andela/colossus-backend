import dotenv from 'dotenv';
import path from 'path';

const loc = path.join(__dirname, '../../.env');

dotenv.config({
  path: loc
});

const config = {
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
};

export default config;
