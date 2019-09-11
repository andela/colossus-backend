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
let accommodation = null;
let room = null;

describe('Room test suites', () => {
  before((done) => {
    User.create({
      firstName: 'Travel',
      lastName: 'Admin',
      email: 'traveladmin109@barefootnomad.com',
      password: 'password',
      isVerified: true,
      role: 'travel_admin'
    })
      .then((user) => {
        token = jwt.sign({
          email: user.email,
          id: user.id
        }, process.env.JWT_SECRET);

        chai.request(app)
          .post(`${root}/`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'Kampala',
            location: 'Southern Uganda'
          })
          .then((res) => {
            accommodation = res.body.data;
            done();
          });
      });
  });
  describe('Main tests', () => {
    it('should throw validation errors when the request body is empty', (done) => {
      chai.request(app)
        .post(`${root}/${accommodation.id}/room`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { status } = res;
          expect(status).to.be.eql(400);
          done();
        });
    });
    it('should create a room in an accommodation facility', (done) => {
      chai.request(app)
        .post(`${root}/${accommodation.id}/room`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Cabin',
          type: 'Courtyard'
        })
        .end((err, res) => {
          const { status } = res;
          room = res.body.data;
          expect(status).to.be.eql(201);
          done();
        });
    });
    it('should get all the rooms in an accommodation facility', (done) => {
      chai.request(app)
        .get(`${root}/${accommodation.id}/room`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { status } = res;
          expect(status).to.be.eql(200);
          done();
        });
    });
    it('should update a room in an accommodation facility', (done) => {
      chai.request(app)
        .patch(`${root}/${accommodation.id}/room/${room.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Cabin',
          type: 'Updated Courtyard'
        })
        .end((err, res) => {
          const { status } = res;
          expect(status).to.be.eql(200);
          done();
        });
    });
    it('should delete a room in an accommodation facility', (done) => {
      chai.request(app)
        .delete(`${root}/${accommodation.id}/room/${room.id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { status } = res;
          expect(status).to.be.eql(200);
          done();
        });
    });
  });
});
