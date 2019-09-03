import '@babel/polyfill';
import express from 'express';
import winston from 'winston';
import swaggerUi from 'swagger-ui-express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import socketIo from 'socket.io';
import http from 'http';
import expressValidator from 'express-validator';
import passport from 'passport';
import swaggerDocument from './docs/swagger';
import routes from './routes';

const app = express();
const server = http.Server(app);
const io = socketIo(server);

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
// app.use(express.static('../public'));
// app.use('/getDocument', express.static(path.join(__dirname, '../public')));
// app.use('/api/v1/trips/create', express.static(path.join(__dirname, '../public')));

app.use(expressValidator());

app.use(require('morgan')('dev'));


app.get('/', (req, res) => res.status(200).json({
  status: 200,
  message: 'Welcome To Barefoot nomad',
}));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1/trips/create', express.static(`${__dirname}/public`));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(require('method-override')());

app.use(cookieParser());
app.use(
  session({
    secret: 'authorshaven',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes(io));

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
server.listen(PORT, () => {
  logger.info(`Listening on PORT ${PORT}`);
});


io.on('connection', (client) => {
  logger(`A client connected ${client.id}`);
  client.emit('confirmation', 'We are successfully connected');

  client.on('disconnect', () => {
    logger(`A user connected ${client.id}`);
  });
});
export default server;
