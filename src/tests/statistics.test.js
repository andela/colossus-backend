import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import app from '..';
import models from '../models';

dotenv.config();

chai.use(chaiHttp);

const { User } = models;
const root = '/api/v1';
let token = null;

describe('Statistics test suites', () => {
  before((done) => {
    User.create({
      firstName: 'Jake',
      lastName: 'Herman',
      email: 'jakehermantheman@app.com',
      password: 'password',
      isVerified: true
    })
      .then((user) => {
        token = jwt.sign(
          {
            email: user.email,
            id: user.id
          }, process.env.JWT_SECRET
        );
        done();
      });
  });
  describe('Main test', () => {
    it('should check for most travelled destination', (done) => {
      chai.request(app)
        .get(`${root}/destination/most_travelled`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body, status } = res;
          const isTrue = Object.keys(body).some((val) => val === 'data');
          expect(isTrue).to.be.eql(true);
          expect(status).to.be.eql(200);
          done();
        });
    });
  });
});
