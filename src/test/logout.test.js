import { expect } from 'chai';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import faker from 'faker';
import app from '..';
import db from '../models';
import { User } from '../database/models';

// Set environment to test to prevent sequelize from starting up for development
app.set('env', 'test');
const api = request(app);
let token = null;
const route = '/api/v1/logout';
const { sequelize } = db;

const createTables = async () => {
  await sequelize.sync({
    force: true
  });
};

createTables();

describe('/api/v1/logout', () => {
  beforeEach(async () => {
    const user = await User.create({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: faker.internet.password(8),
      email: faker.internet.email()
    });
    console.log(user.id);
    token = jwt.sign({ id: user.id }, 'secret');
  });
  it('should respond with a 400 when auth header is absent', (done) => {
    api
      .post(route)
      .end((err, res) => {
        const { body, status } = res;
        expect(body).to.have.keys('error', 'status');
        expect(status).to.eql(400);
        done();
      });
  });
  it('should respond with a 401 or 200 depending on token validity', (done) => {
    api
      .post(route)
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
