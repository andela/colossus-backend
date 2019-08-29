import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import server from '../index';
import models from '../models';
import helper from '../helpers/jwtHelper';

const { generateToken } = helper;

dotenv.config();

const {
  Request,
  Trip,
} = models;

const { expect } = chai;
chai.should();
chai.use(chaiHttp);

describe('GET /api/v1/request', () => {
  let token;
  describe('Tests for for getting requests', () => {
    before((done) => {
      // Sign up a user to get a token to use for the protected route
      chai.request(server)
        .post('/api/v1/auth/signup')
        .type('form')
        .send({
          firstName: 'James',
          lastName: 'Potter',
          email: 'wolverine@hogwarts.com',
          password: 'expeliamus',
        })
        .end((err, res) => {
          // generate a verified token to access protected routes
          token = generateToken({
            id: res.body.data.id,
            email: res.body.data.email,
            isVerified: true
          });
          // create a request and trip by adding values to the tables
          Request.create({
            userId: res.body.data.id,
            passportName: 'test name',
            reason: 'test reason',
            managerId: 1, // There is no association for this field currently
            status: 'pending',
            type: '1-way',
          })
            .then((newRequest) => {
              Trip.create({
                requestId: newRequest.id,
                from: 'lagos',
                to: 'kampala',
                departureDate: '2019-08-09 13:00',
                arrivalDate: '2019-08-10 13:00',
                accommodation: 'hilton',
              })
                .then(() => {
                  done();
                });
            });
        });
    });
    it('Should return an object with properties "status" and "data" on success', (done) => {
      chai.request(server)
        .get('/api/v1/request')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          // eslint-disable-next-line no-unused-expressions
          expect(err).to.be.null;
          expect(res).to.has.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.haveOwnProperty('status');
          expect(res.body.status).to.equal(200);
          expect(res.body).to.haveOwnProperty('data');
          expect(res.body.data).to.be.a('array');
          expect(res.body.data[0]).to.be.a('object');
          expect(res.body.data[0]).to.haveOwnProperty('id');
          expect(res.body.data[0]).to.haveOwnProperty('userId');
          expect(res.body.data[0]).to.haveOwnProperty('reason');
          expect(res.body.data[0]).to.haveOwnProperty('managerId');
          expect(res.body.data[0]).to.haveOwnProperty('status');
          expect(res.body.data[0]).to.haveOwnProperty('type');
          done();
        });
    });
  });
});
