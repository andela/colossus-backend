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

        User.create({
          firstName: 'Travel',
          lastName: 'Admin',
          email: 'traveladmin2@barefootnomad.com',
          password: 'password',
          isVerified: true,
          role: 'travel_admin'
        })
          .then((user2) => {
            token = jwt.sign({
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
          owner: 1
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
          owner: 1
        })
        .end((err, res) => {
          const { status } = res;
          expect(status).to.be.eql(200);
          done();
        });
    });
    // it('should create a room', (done) => {
    //   chai.request(app)
    //     .post(`${root}/accommodation/${accommodationId}/room`)
    //     .set('Authorization', `Bearer ${token}`)
    //     .send({
    //       name: 'Colony',
    //       type: 'Broad',
    //       cost: 1000000
    //     })
    //     .end((err, res) => {
    //       const { status, body } = res;
    //       const { data } = body;
    //       roomId = data.id;
    //       expect(status).to.be.eql(201);
    //       done();
    //     });
    //  });
    // it('should book a room', (done) => {
    //   chai.request(app)
    //     .patch(`${root}/room/book/${roomId}`)
    //     .set('Authorization', `Bearer ${token}`)
    //     .end((err, res) => {
    //       const { status } = res;
    //       expect(status).to.be.eql(200);
    //       done();
    //     });
    // });
  });
});
