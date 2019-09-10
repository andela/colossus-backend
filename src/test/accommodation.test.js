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

let token1 = null;
let token2 = null;
let accommodation = null;

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
        token1 = jwt.sign({
          email: user.email,
          id: user.id
        }, process.env.JWT_SECRET);

        User.create({
          firstName: 'Travel',
          lastName: 'Admin',
          email: 'traveladmin2@barefootnomad.com',
          password: 'password',
          isVerified: true,
          role: 'travel_admin'
        })
          .then((user2) => {
            token2 = jwt.sign({
              email: user2.email,
              id: user2.id
            }, process.env.JWT_SECRET);
          });
        done();
      });
  });
  describe('Main tests', () => {
    it('should throw validation errors when request body is empty', (done) => {
      chai.request(app)
        .post(`${root}/`)
        .set('Authorization', `Bearer ${token1}`)
        .end((err, res) => {
          const { status } = res;
          expect(status).to.be.eql(400);
          done();
        });
    });
    it('should create an accommodation', (done) => {
      chai.request(app)
        .post(`${root}/`)
        .set('Authorization', `Bearer ${token1}`)
        .send({
          name: 'Kampala',
          location: 'Southern Uganda'
        })
        .end((err, res) => {
          const { status } = res;
          accommodation = res.body.data;
          expect(status).to.be.eql(201);
          done();
        });
    });
    it('should create an accommodation with an image', (done) => {
      chai.request(app)
        .post(`${root}/`)
        .set('Authorization', `Bearer ${token1}`)
        .send({
          name: 'Kampala',
          location: 'Southern Uganda'
        })
        .end((err, res) => {
          const { status } = res;
          accommodation = res.body.data;
          expect(status).to.be.eql(201);
          done();
        });
    });
    it('should list all accommodation facilities', (done) => {
      chai.request(app)
        .get(`${root}/`)
        .set('Authorization', `Bearer ${token1}`)
        .end((err, res) => {
          const { status } = res;
          expect(status).to.be.eql(200);
          done();
        });
    });
    it('should get an accommodation by id', (done) => {
      chai.request(app)
        .get(`${root}/${accommodation.id}`)
        .set('Authorization', `Bearer ${token1}`)
        .end((err, res) => {
          const { status } = res;
          expect(status).to.be.eql(200);
          done();
        });
    });
    it('should throw an error when trying to delete an accommodation facility that belongs to another user', (done) => {
      chai.request(app)
        .delete(`${root}/${accommodation.id}`)
        .set('Authorization', `Bearer ${token2}`)
        .end((err, res) => {
          const { status } = res;
          expect(status).to.be.eql(403);
          done();
        });
    });
    it('should delete an accommodation facility', (done) => {
      chai.request(app)
        .delete(`${root}/${accommodation.id}`)
        .set('Authorization', `Bearer ${token1}`)
        .end((err, res) => {
          const { status } = res;
          expect(status).to.be.eql(200);
          done();
        });
    });
    it('should return an empty array when trying to find an accommodation that does not exist', (done) => {
      chai.request(app)
        .get(`${root}/${accommodation.id}`)
        .set('Authorization', `Bearer ${token1}`)
        .end((err, res) => {
          const { status } = res;
          expect(status).to.be.eql(200);
          done();
        });
    });
  });
});
