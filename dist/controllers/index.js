"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.xController = exports.AuthController = void 0;

var _auth = _interopRequireDefault(require("./auth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var AuthController = _auth["default"]; // An example for subsequent controller imports

exports.AuthController = AuthController;
var xController = 'xController';
exports.xController = xController;