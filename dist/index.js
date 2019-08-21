"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("@babel/polyfill");

var _express = _interopRequireDefault(require("express"));

var _winston = _interopRequireDefault(require("winston"));

var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _swagger = _interopRequireDefault(require("./docs/swagger"));

var _routes = _interopRequireDefault(require("./routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var isProduction = process.env.NODE_ENV === 'production';

var logger = _winston["default"].createLogger({
  level: 'info',
  format: _winston["default"].format.json(),
  defaultMeta: {
    service: 'user-service'
  },
  transports: [new _winston["default"].transports.File({
    filename: 'error.log',
    level: 'error'
  }), new _winston["default"].transports.File({
    filename: 'combined.log'
  })]
});

app.use((0, _cors["default"])());
app.use(_bodyParser["default"].urlencoded({
  extended: false
}));
app.use(_bodyParser["default"].json());
app.use(_express["default"]["static"]("".concat(__dirname, "/public")));
app.get('/', function (req, res) {
  return res.status(200).json({
    status: 200,
    message: 'Welcome To Barefoot nomad'
  });
});
app.use('/api-docs', _swaggerUiExpress["default"].serve, _swaggerUiExpress["default"].setup(_swagger["default"]));
app.use(require('morgan')('dev'));
app.use(require('method-override')());
app.use((0, _expressSession["default"])({
  secret: 'authorshaven',
  cookie: {
    maxAge: 60000
  },
  resave: false,
  saveUninitialized: false
}));
app.use('/', _routes["default"]);
app.get('/', function (req, res) {
  return res.status(200).json({
    status: 200,
    message: 'Welcome To Barefoot nomad'
  });
});

if (!isProduction) {
  logger.add(new _winston["default"].transports.Console({
    format: _winston["default"].format.simple()
  }));
}

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (!isProduction) {
  app.use(function (err, req, res, next) {
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

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  });
  next();
});
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  logger.info("Listening on PORT ".concat(PORT));
});
var _default = app;
exports["default"] = _default;