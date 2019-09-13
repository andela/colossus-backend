import '@babel/polyfill';
import express from 'express';
import passport from 'passport';
import session from 'express-session';
import winston from 'winston';
import swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';
import socketIo from 'socket.io';
import cors from 'cors';
import expressValidator from 'express-validator';
import swaggerDocument from './docs/swagger';
import routes from './routes';
import { chat } from './services';
import models from './models';

const { Chat, User } = models;

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
app.use(express.static(`${__dirname}/public`));
app.use(expressValidator());

app.use(require('morgan')('dev'));


app.get('/', (req, res) => res.status(200).json({
  status: 200,
  message: 'Welcome To Barefoot nomad',
}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(session({
  secret: 'authorshaven',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1', routes);

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
const server = app.listen(PORT, () => {
  logger.info(`Listening on PORT ${PORT}`);
});

export const io = socketIo(server);
io.on('connect', (client) => {
  logger.info(`New connection, form client ${client.id}`);
  client.on('CHAT', async (data) => {
    await Chat.create({
      message: data.message,
      userId: data.user.id
    });
    const allChats = await Chat.findAll({
      include: [User]
    });
    chat('MESSAGE_RECEIVED', allChats);
  });
});
io.on('disconnet', (client) => {
  logger.info(`Disconnection, form client ${client.id}`);
});

export default app;
