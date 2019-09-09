import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import models from '../models';
import app from '..';

dotenv.config();

const { User } = models;
const root = '/api/v1/accommodation';

chai.use(chaiHttp);

let token = null;

describe('Accommodation test suites', () => {
  before((done) => {
    User.create({
      firstName: 'Travel',
      lastName: 'Admin',
      email: 'traveladmin1@barefootnomad.com',
      password: 'password',
      isVerified: true,
      role: 'travel_admin'
    })
      .then((user) => {
        token = jwt.sign({
          email: user.email,
          id: user.id
        }, process.env.JWT_SECRET);
        done();
      });
  });
  describe('Main tests', () => {
    it('should create an accommodation', (done) => {
      chai.request(app)
        .post(`${root}/`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Kampala',
          location: 'Southern Uganda'
        })
        .end((err, res) => {
          const { status } = res;
          expect(status).to.be.eql(201);
          done();
        });
    });
  });
  // it('should book an accommodation', (done) => {
  //   chai.request(app)
  //     .post(`${root}/book?id=1`)
  //     .set('Authorization', `Bearer ${token}`)
  //     .send({
  //       movingIn: '2019-09-04',
  //       movingOut: '2019-10-04'
  //     })
  //     .end((err, res) => {
  //       const { status } = res;
  //       expect(status).to.be.eql(200);
  //       done();
  //     });
  // });
});
