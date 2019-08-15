import express from 'express';
import winston from 'winston';
import fs from 'fs';
import passport from 'passport';
import bodyParser from 'body-parser';
import session from 'express-session';
import http from 'http';
import errorhandler from 'errorhandler';
import methods from 'methods';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.json';
import { UserModel, sequelize} from './database/config';
import faker from 'faker';

const app = express();

const isProduction = process.env.NODE_ENV === "production";

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('method-override')());

app.use(express.static(`${__dirname}/public`));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(require('morgan')('dev'));
app.use(require('method-override')());
app.use(
  session({
    secret: 'authorshaven',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

if (!isProduction) {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (!isProduction) {
  app.use((err, req, res, next) => {
    logger.error(err.stack);

    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err
      }
    });
  });
}

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  });
});

const PORT = process.env.PORT || 3000;

if (!isProduction) {
    sequelize.sync({force: true}).then((val) => {
        UserModel.create({
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(8)
        }).then((user) => {
            console.log(user);
        })
    });
}

app.listen(PORT, () => {
  logger.info(`Listening on PORT ${PORT}`);
});

export default app;
