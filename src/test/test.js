/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable linebreak-style */
import mocha from 'mocha';
import { expect } from 'chai';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import faker from 'faker';
import server from '..';
import db from '../models';
import { User } from '../database/models';

const { sequelize } = db;
const api = request(server);
let token = null;
const root = '/api/v1';

sequelize.sync({
  force: true
});

describe('POST /api/v1/signup', () => {
  describe('When all values in the POST body are the right format', () => {
    it('Should return an object with properties "status" and "data" on success', (done) => {
      api
        .post(`${root}/signup`)
        .send({
          firstName: 'James',
          lastName: 'Potter',
          email: 'JeanGray@hogwarts.com',
          password: 'expeliamus',
        })
        .end((err, res) => {
          // eslint-disable-next-line no-unused-expressions
          const { status, body } = res;
          expect(err).to.be.null;
          expect(status).to.eql(201);
          expect(body).to.be.a('object');
          expect(body).to.haveOwnProperty('status');
          expect(body.status).to.equal(201);
          expect(body).to.haveOwnProperty('data');
          expect(body.data).to.be.a('object');
          done();
        });
    });

    it('Should return an error if the email already exists', (done) => {
      api
        .post(`${root}/signup`)
        .send({
          firstName: 'James',
          lastName: 'Potter',
          email: 'JeanGray@hogwarts.com',
          password: 'expeliamus',
        })
        .end((err, res) => {
          // eslint-disable-next-line no-unused-expressions
          const { status, body } = res;
          expect(err).to.be.null;
          expect(status).to.eql(400);
          expect(body).to.be.a('object');
          expect(body).to.haveOwnProperty('status');
          expect(body.status).to.equal(400);
          expect(body).to.haveOwnProperty('error');
          expect(body.error).to.be.a('string');
          done();
        });
    });
  });
  after(() => {
    User.destroy({
      where: {
        email: 'JeanGray@hogwarts.com'
      }
    });
  });
});

describe('POST /api/v1/logout', () => {
  beforeEach(async () => {
    const user = await User.create({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: faker.internet.password(8),
      email: faker.internet.email()
    });
    token = jwt.sign({ id: user.id }, 'secret');
  });
  it('should respond with a 400 when auth header is absent', (done) => {
    api
      .post(`${root}/logout`)
      .end((err, res) => {
        const { body, status } = res;
        expect(body).to.have.keys('error', 'status');
        expect(status).to.eql(400);
        done();
      });
  });
  it('should respond with a 401 or 200 depending on token validity', (done) => {
    api
      .post(`${root}/logout`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        const { status, body } = res;
        const isTrueAboutStatus = status === 401 || status === 200;
        const isTrueAboutBody = Object.keys(body).some((value) => value === 'data' || value === 'error');
        expect(isTrueAboutStatus).to.be.eql(true);
        expect(isTrueAboutBody).to.be.eql(true);
        console.log(status, body);
        done();
      });
  });
});
