import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import models from '../models';
import app from '..';

dotenv.config();

const { Accommodation, User } = models;
const root = '/api/v1/like';
let token = null;
let accommodationId = null;

chai.use(chaiHttp);

describe('Like tests', () => {
  before((done) => {
    User.create({
      firstName: 'Jeremias',
      lastName: 'Damian',
      email: 'jDamian@app.com',
      password: 'password',
      isVerified: true
    })
      .then((user) => {
        token = jwt.sign({
          email: user.email,
          id: user.id
        }, process.env.JWT_SECRET);
        Accommodation.create({
          name: 'chateau',
          location: 'Ghana',
          owner: 1
        })
          .then((accommodation) => {
            accommodationId = accommodation.id;
            done();
          });
      });
  });
  describe('Main tests', () => {
    it('should like an accommodation facility', (done) => {
      chai.request(app)
        .post(`${root}/create/${accommodationId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { status, body } = res;
          const isTrueAboutBody = Object.keys(body).some((value) => value === 'data');
          expect(isTrueAboutBody).to.be.eql(true);
          expect(status).to.be.eql(201);
          done();
        });
    });
    it('should unlike an accommodation facility', (done) => {
      chai.request(app)
        .delete(`${root}/unlike/${accommodationId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { status, body } = res;
          const { data } = body;
          expect(data).to.be.a('string');
          expect(status).to.be.eql(200);
          done();
        });
    });
  });
});
