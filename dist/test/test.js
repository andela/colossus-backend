"use strict";

var _mocha = _interopRequireDefault(require("mocha"));

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _index = _interopRequireDefault(require("../index"));

var _models = _interopRequireDefault(require("../models"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable linebreak-style */
var UserModel = _models["default"].User;
var expect = _chai["default"].expect;

_chai["default"].use(_chaiHttp["default"]);

describe('POST /api/v1/auth/signup', function () {
  describe('When all values in the POST body are the right format', function () {
    it('Should return an object with properties "status" and "data" on success', function (done) {
      _chai["default"].request(_index["default"]).post('/api/v1/auth/signup').type('form').send({
        firstName: 'James',
        lastName: 'Potter',
        email: 'JeanGray@hogwarts.com',
        password: 'expeliamus'
      }).end(function (err, res) {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be["null"];
        expect(res).to.has.status(201);
        expect(res.body).to.be.a('object');
        expect(res.body).to.haveOwnProperty('status');
        expect(res.body.status).to.equal(201);
        expect(res.body).to.haveOwnProperty('data');
        expect(res.body.data).to.be.a('object');
        done();
      });
    });
    it('Should return an error if the email already exists', function (done) {
      _chai["default"].request(_index["default"]).post('/api/v1/auth/signup').type('form').send({
        firstName: 'James',
        lastName: 'Potter',
        email: 'JeanGray@hogwarts.com',
        password: 'expeliamus'
      }).end(function (err, res) {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be["null"];
        expect(res).to.has.status(400);
        expect(res.body).to.be.a('object');
        expect(res.body).to.haveOwnProperty('status');
        expect(res.body.status).to.equal(400);
        expect(res.body).to.haveOwnProperty('error');
        expect(res.body.error).to.be.a('string');
        done();
      });
    });
  });
  after(function (done) {
    UserModel.destroy({
      where: {
        email: 'JeanGray@hogwarts.com'
      }
    }).then(function () {
      done();
    });
  });
});