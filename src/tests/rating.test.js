/* eslint-disable no-dupe-keys */
import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import server from '../index';
import models from '../models';
import helper from '../helpers/jwtHelper';

const { generateToken } = helper;

dotenv.config();

const {
  Accommodation,
  Room,
  User,
} = models;

const { expect } = chai;
chai.should();
chai.use(chaiHttp);

describe('POST /api/v1/rating', () => {
  let normalUser;
  let normalUserToken;
  let accommodation;
  let room;
  describe('Tests for rating an accommodation/centre', () => {
    before((done) => {
      // Create a normal user
      User.create({
        firstName: 'normal',
        lastName: 'User',
        email: 'normalUser@test.com',
        password: 'test',
        isVerified: true,
      }).then((NormalUser) => {
        // Create accommodation
        normalUser = NormalUser;
        Accommodation.create({
          name: 'test',
          image: 'test',
          location: 'test',
          owner: 1,
          totalNumberOfRooms: 10,
          bookedBy: 1,
          startedBy: 1,
        }).then((AccommodatioN) => {
          accommodation = AccommodatioN;
          // generate a verified token to access protected routes
          normalUserToken = generateToken({
            id: normalUser.id,
            email: normalUser.email,
            isVerified: true
          });
          // create a room booked by the normalUser
          Room.create({
            name: 'test',
            type: 'test',
            accommodationId: accommodation.id,
            bookedBy: normalUser.id,
          })
            .then((RooM) => {
              room = RooM;
              done();
            });
        });
      });
    });
    it('Should return the details of the accommodation rating', (done) => {
      chai.request(server)
        .post('/api/v1/rating')
        .set('Authorization', `Bearer ${normalUserToken}`)
        .send({ accommodationId: accommodation.id, rating: 5 })
        .end((err, res) => {
          // eslint-disable-next-line no-unused-expressions
          expect(err).to.be.null;
          expect(res).to.has.status(200);
          expect(res.body).to.haveOwnProperty('status');
          expect(res.body.status).to.equal(200);
          expect(res.body.data).to.haveOwnProperty('averageRating');
          expect(res.body.data).to.haveOwnProperty('numberOfRatings');
          done();
        });
    });
    it('Should return the details of the accommodation rating', (done) => {
      chai.request(server)
        .post('/api/v1/rating')
        .set('Authorization', `Bearer ${normalUserToken}`)
        .send({ accommodationId: accommodation.id, rating: 3 })
        .end((err, res) => {
          // eslint-disable-next-line no-unused-expressions
          expect(err).to.be.null;
          expect(res).to.has.status(200);
          expect(res.body).to.haveOwnProperty('status');
          expect(res.body.status).to.equal(200);
          expect(res.body.data).to.haveOwnProperty('averageRating');
          expect(res.body.data).to.haveOwnProperty('numberOfRatings');
          done();
        });
    });
    it('Should return an error when the rating is not a number', (done) => {
      chai.request(server)
        .post('/api/v1/rating')
        .set('Authorization', `Bearer ${normalUserToken}`)
        .send({ accommodationId: accommodation.id, rating: 'f' })
        .end((err, res) => {
          // eslint-disable-next-line no-unused-expressions
          expect(err).to.be.null;
          expect(res).to.has.status(400);
          expect(res.body).to.haveOwnProperty('status');
          expect(res.body.status).to.equal(400);
          expect(res.body).to.haveOwnProperty('error');
          done();
        });
    });
    it('Should return an error if the rating is more than 5', (done) => {
      chai.request(server)
        .post('/api/v1/rating')
        .set('Authorization', `Bearer ${normalUserToken}`)
        .send({ accommodationId: accommodation.id, rating: 6 })
        .end((err, res) => {
          // eslint-disable-next-line no-unused-expressions
          expect(err).to.be.null;
          expect(res).to.has.status(400);
          expect(res.body).to.haveOwnProperty('status');
          expect(res.body.status).to.equal(400);
          expect(res.body).to.haveOwnProperty('error');
          done();
        });
    });
    it('Should return an error if any of the required parameters are missing', (done) => {
      chai.request(server)
        .post('/api/v1/rating')
        .set('Authorization', `Bearer ${normalUserToken}`)
        .send({ accommodationId: accommodation.id })
        .end((err, res) => {
          // eslint-disable-next-line no-unused-expressions
          expect(err).to.be.null;
          expect(res).to.has.status(400);
          expect(res.body).to.haveOwnProperty('status');
          expect(res.body.status).to.equal(400);
          expect(res.body).to.haveOwnProperty('error');
          done();
        });
    });
    it('Should return an error if the user tries to rate an accommodation they havent been too', (done) => {
      chai.request(server)
        .post('/api/v1/rating')
        .set('Authorization', `Bearer ${normalUserToken}`)
        .send({ accommodationId: 55, rating: 5 })
        .end((err, res) => {
          // eslint-disable-next-line no-unused-expressions
          expect(err).to.be.null;
          expect(res).to.has.status(401);
          expect(res.body).to.haveOwnProperty('status');
          expect(res.body.status).to.equal(401);
          expect(res.body).to.haveOwnProperty('error');
          done();
        });
    });
  });
});
