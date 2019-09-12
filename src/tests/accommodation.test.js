import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import models from '../models';
import app from '..';

dotenv.config();

const { User } = models;
const root = '/api/v1';

chai.use(chaiHttp);

let token = null;
let accommodationId = null;
let roomId = null;
let userId = null;

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
        userId = user.id;
        done();
      });
  });
  describe('Main tests', () => {
    it('should throw validation errors when request body is empty', (done) => {
      chai.request(app)
        .post(`${root}/accommodation`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { status } = res;
          expect(status).to.be.eql(400);
          done();
        });
    });
    it('should create an accommodation', (done) => {
      chai.request(app)
        .post(`${root}/accommodation`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Kampala',
          location: 'Southern Uganda',
          type: 'chateau',
          totalNumberOfRooms: 5,
          owner: userId,
        })
        .end((err, res) => {
          const { status, body } = res;
          const { data } = body;
          accommodationId = data.id;
          expect(status).to.be.eql(201);
          done();
        });
    });
    it('should update an accommodation', (done) => {
      chai.request(app)
        .patch(`${root}/accommodation/${accommodationId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Sudan',
          location: 'Southern Uganda',
          type: 'chateau',
          totalNumberOfRooms: 3,
          owner: userId
        })
        .end((err, res) => {
          const { status } = res;
          expect(status).to.be.eql(200);
          done();
        });
    });
    it('should get an accommodation', (done) => {
      chai.request(app)
        .get(`${root}/accommodation/${accommodationId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { status } = res;
          expect(status).to.be.eql(200);
          done();
        });
    });
    it('should get all accommodation facilities', (done) => {
      chai.request(app)
        .get(`${root}/accommodation`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { status } = res;
          expect(status).to.be.eql(200);
          done();
        });
    });
    it('should create a room', (done) => {
      chai.request(app)
        .patch(`${root}/accommodation/${accommodationId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Colony',
          type: 'Broad',
          cost: 1000000
        })
        .end((err, res) => {
          const { status } = res;
          expect(status).to.be.eql(200);
          done();
        });
    });
    it('should delete an accommodation', (done) => {
      chai.request(app)
        .delete(`${root}/accommodation/${accommodationId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { status } = res;
          expect(status).to.be.eql(200);
          done();
        });
    });
  });
});
