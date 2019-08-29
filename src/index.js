import '@babel/polyfill';
import express from 'express';
import passport from 'passport';
import session from 'express-session';
import winston from 'winston';
import swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import expressValidator from 'express-validator';
import swaggerDocument from './docs/swagger';
import routes from './routes';
import db from './models';

const app = express();
const { sequelize } = db;

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

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
app.use(expressValidator());

app.use(require('morgan')('dev'));


app.get('/', (req, res) => res.status(200).json({
  status: 200,
  message: 'Welcome To Barefoot nomad',
}));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(session({
  secret: 'authorshaven',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

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

// Run sync if environment is development.
// This would drop created tables.
// Do not run in production or test
// Not ideal for test environment
// if (!isTest) {
//   sequelize.sync({
//     force: !isProduction
//   });
// }

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Listening on PORT ${PORT}`);
});

export default app;
