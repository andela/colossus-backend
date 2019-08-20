import '@babel/polyfill';
import express from 'express';
import winston from 'winston';
import swaggerUi from 'swagger-ui-express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerDocument from './docs/swagger';
import router from './routes';
import db from './models';
import jwt from 'jsonwebtoken';
import faker from 'faker';
import { User } from './database/models';


const app = express();
const { sequelize } = db;

const isProduction = process.env.NODE_ENV === 'production';

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
app.use(express.static(`${__dirname}/public`));
app.use('/api/v1', router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
    next();
  });
}

if (!isProduction) {
  const force = true;
  sequelize.sync({force}).then(v => {
    User.create({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: faker.internet.password(),
      email: faker.internet.email()
    })
      .then(user => {
        const token = jwt.sign({id: user.id}, 'secret', {
          expiresIn: 60 * 2
        });
        logger.info(token);
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
  next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Listening on PORT ${PORT}`);
});

export default app;
