import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import server from '../index';
import models from '../models';

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
  let userId;
  let requestId;
  const request = {
    userId,
    reason: 'test reason',
    managerId: 1, // There is no association for this field currently
    status: 'pending',
    type: '1-way',
  }; const trip = {
    requestId,
    from: 'lagos',
    to: 'kampala',
    departureDate: '2019-08-09 13:00',
    arrivalDate: '2019-08-10 13:00',
    accommodation: 'hilton',
  };
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
          token = res.body.data.token;
          userId = res.body.data.id;
          expect(res).to.has.status(201);
          expect(res.body).to.be.a('object');
          expect(res.body).to.haveOwnProperty('status');
          expect(res.body.status).to.equal(201);
          expect(res.body).to.haveOwnProperty('data');
          expect(res.body.data).to.be.a('object');
          // create a request and trip by adding values to the tables
          Request.create(request)
            .then((newRequest) => {
              requestId = newRequest.id;
              Trip.create(trip)
                .then(() => {
                  done();
                });
            });
          // const newRequest = await Request.create(request).catch(error => console.log(error));
          // requestId = newRequest.id;
          // await Trip.create(trip).catch(error => console.log(error));
          // done();
        });
    });
    after((done) => {
      Request.destroy({
        where: {
          id: requestId,
        }
      }).then(() => {
        done();
      });
    });
    it('Should return an object with properties "status" and "data" on success', (done) => {
      chai.request(server)
        .set('Authorization', `Bearer ${token}`)
        .get('/api/v1/request')
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
