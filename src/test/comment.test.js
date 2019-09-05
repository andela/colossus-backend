import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import server from '../index';
import models from '../models';
import helper from '../helpers/jwtHelper';

const { generateToken } = helper;

let userId;
let token;

dotenv.config();

const {
  Request,
  Trip,
  User
} = models;

const { expect } = chai;
chai.should();
chai.use(chaiHttp);

describe('POST /api/v1/request/:requestId/comment', () => {
  let requestId;
  describe('Creating a new newcomment', () => {
    before((done) => {
      // Create lineManager user
      User.create({
        firstName: 'John',
        lastName: 'Neo',
        email: 'test@domain.com',
        password: 'tester123',
        isVerified: true
      }).then(user => {
        userId = user.id;
        token = generateToken({
          id: userId,
          email: user.email,
          isVerified: user.isVerified
        });
        Request.create({
          userId,
          passportName: 'normal User',
          reason: 'test reason',
          lineManagerId: 1,
          status: 'pending',
          type: 'one-way',
        }).then(newRequest => {
          Trip.create({
            requestId: newRequest.id,
            from: 'lagos',
            to: 'kampala',
            departureDate: '2019-08-09 13:00',
            accommodation: 'hilton'
          }).then(() => {
            done();
          });
        });
      });
    });

    it('Should return details of the new comments on a request', (done) => {
      chai.request(server)
        .post('/api/v1/request/1/comment')
        .set('Authorization', `Bearer ${token}`)
        .send({
          commentBody: 'test comments',
          userId,
          requestId
        })
        .end((err, res) => {
          // eslint-disable-next-line no-unused-expressions
          expect(err).to.be.null;
          expect(res).to.has.status(201);
          expect(res.body).to.haveOwnProperty('status');
          expect(res.body.status).to.equal('success');
          expect(res.body).to.haveOwnProperty('data');
          done();
        });
    });

    it('Should respond with error object if an empty comment is made', (done) => {
      chai.request(server)
        .post('/api/v1/request/1/comment')
        .set('Authorization', `Bearer ${token}`)
        .send({
          commentBody: '',
          userId,
          requestId
        })
        .end((err, res) => {
          // eslint-disable-next-line no-unused-expressions
          expect(res).to.has.status(400);
          expect(res.body).to.haveOwnProperty('status');
          expect(res.body).to.haveOwnProperty('error');
          done();
        });
    });

    it('Should respond with error object if a bad comment request is made', (done) => {
      chai.request(server)
        .post('/api/v1/request/1/comment')
        .set('Authorization', `Bearer ${token}`)
        .send({
          commentBody: 1,
          userId,
          requestId
        })
        .end((err, res) => {
          // eslint-disable-next-line no-unused-expressions
          expect(res).to.has.status(400);
          expect(res.body).to.haveOwnProperty('status');
          expect(res.body).to.haveOwnProperty('error');
          done();
        });
    });
  });
});
