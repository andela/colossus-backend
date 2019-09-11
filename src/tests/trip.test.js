import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import server from '../index';
import models from '../models';
import helper from '../helpers/jwtHelper';

const { generateToken } = helper;
dotenv.config();

let token;
let tripId;

const {
  Request,
  Trip,
} = models;

const { expect } = chai;

chai.should();

chai.use(chaiHttp);


describe('DELETE /api/v1/trip/:id', () => {
  before((done) => {
    // Sign up a user to get a token to use for the protected route
    chai.request(server)
      .post('/api/v1/auth/signup')
      .type('form')
      .send({
        firstName: 'James',
        lastName: 'Potter',
        email: 'wolverine2@hogwarts.com',
        password: 'expeliamus',
      })
      .end((err, res) => {
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
          lineManagerId: 1, // There is no association for this field currently
          status: 'pending',
          type: 'one-way',
        })
          .then((newRequest) => {
            Trip.create({
              requestId: newRequest.id,
              from: 'lagos',
              to: 'kampala',
              departureDate: '2019-08-09 13:00',
              accommodation: 'hilton'
            })
              .then((tripInfo) => {
                tripId = tripInfo.id;
                done();
              });
          });
      });
  });
  it('Should successfully delete a trip', (done) => {
    chai
      .request(server)
      .delete(`/api/v1/trip/${tripId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal(200);
        expect(res.body.message).to.be.equal('Trip successfully deleted');
        done();
      });
  });
  it('Should throw an error if the id is not a valid integer', (done) => {
    chai
      .request(server)
      .delete('/api/v1/trip/string')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.equal('Invalid id supplied');
        done();
      });
  });
  it('Should throw an error if the trip with the id does not exist', (done) => {
    chai
      .request(server)
      .delete('/api/v1/trip/50000')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.status).to.be.equal(404);
        expect(res.body.error).to.be.equal('No trip with the stated id');
        done();
      });
  });
});
