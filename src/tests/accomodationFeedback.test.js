import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../index';
import models from '../models';
import helper from '../helpers/jwtHelper';

const { generateToken } = helper;

let userId;
let accommodationId;
let token;

const {
  Accommodation,
  User
} = models;

const { expect } = chai;
chai.should();
chai.use(chaiHttp);

before((done) => {
  // Create a user
  User.create({
    firstName: 'TestUser',
    lastName: 'Neo',
    email: 'testEmail@domain.com',
    password: 'password',
    isVerified: true
  }).then((user) => {
    userId = user.id;
    token = generateToken({
      id: userId,
      email: user.email,
      isVerified: user.isVerified
    });

    Accommodation.create({
      userId,
      name: 'lagos',
      location: 'kampala',
      owner: userId,
    }).then((accommodation) => {
      accommodationId = accommodation.id;
      done();
    });
  });
});
describe('POST /accommodation/:accommodationId/feedback, Creating a new feedback', () => {
  it('Should successfully create a feedback and return details of the new feedback', (done) => {
    chai.request(server)
      .post(`/api/v1/accommodation/${accommodationId}/feedback`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        feedbackBody: 'This is the feedback body',
        userId,
        accommodationId
      })
      .end((err, res) => {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be.null;
        expect(res).to.has.status(201);
        expect(res.body.status).to.equal('success');
        expect(res.body).to.haveOwnProperty('data');
        done();
      });
  });
  it('Should return 400 if not token is provided', (done) => {
    chai.request(server)
      .post('/api/v1/accommodation/1/feedback')
      .send({
        feedbackBody: 'This is the feedback body',
        userId,
        accommodationId
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
