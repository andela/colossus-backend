import '@babel/polyfill';
import express from 'express';
import faker from 'faker';
import winston from 'winston';
import swaggerUi from 'swagger-ui-express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerDocument from './docs/swagger.js/index.js';
import { UserModel, sequelize } from './database/config';

const app = express();

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

app.get('/', (req, res) => res.status(200).json({
  status: 200,
  message: 'Welcome To Barefoot nomad',
}));

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

if (!isProduction) {
  sequelize.sync({ force: true }).then((val) => {
    UserModel.create({
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(8)
    }).then((user) => {
      logger.info(user);
    });
  });
}

app.listen(PORT, () => {
  logger.info(`Listening on PORT ${PORT}`);
});

export default app;
