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
  User,
} = models;

const { expect } = chai;
chai.should();
chai.use(chaiHttp);

describe('GET /api/v1/request', () => {
  describe('Tests for getting requests', () => {
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
          userId = res.body.data.id;
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
          expect(res.body.data[0]).to.haveOwnProperty('lineManagerId');
          expect(res.body.data[0]).to.haveOwnProperty('status');
          expect(res.body.data[0]).to.haveOwnProperty('type');
          done();
        });
    });
  });
});

describe('PATCH /api/v1/request/:requestId/status', () => {
  let lineManager;
  let normalUser;
  let lineManagerToken;
  let travelRequestId;
  describe('Tests for accepting/rejecting a request', () => {
    before((done) => {
      // Create lineManager user
      User.create({
        firstName: 'line',
        lastName: 'Manager',
        email: 'lineManager@test.com',
        password: 'test',
        isVerified: true
      }).then((LineManager) => {
        lineManager = LineManager;
        User.create({
          firstName: 'normal',
          lastName: 'User',
          email: 'normalUser@test.com',
          password: 'test',
          isVerified: true,
          lineManagerId: LineManager.id,
        }).then((NormalUser) => {
          normalUser = NormalUser;
          // generate a verified token to access protected routes
          lineManagerToken = generateToken({
            id: lineManager.id,
            email: lineManager.email,
            isVerified: true
          });
          // create a request and trip by adding values to the tables for the normal user
          Request.create({
            userId: normalUser.id,
            passportName: 'normal User',
            reason: 'test reason',
            lineManagerId: lineManager.id,
            status: 'pending',
            type: 'one-way',
          })
            .then((newRequest) => {
              travelRequestId = newRequest.id;
              Trip.create({
                requestId: newRequest.id,
                from: 'lagos',
                to: 'kampala',
                departureDate: '2019-08-09 13:00',
                accommodation: 'hilton'
              })
                .then(() => {
                  done();
                });
            });
        });
      });
    });
    it('Should return details of the approved travel request', (done) => {
      chai.request(server)
        .patch(`/api/v1/request/${travelRequestId}/status`)
        .set('Authorization', `Bearer ${lineManagerToken}`)
        .send({ approved: true })
        .end((err, res) => {
          // eslint-disable-next-line no-unused-expressions
          expect(err).to.be.null;
          expect(res).to.has.status(200);
          expect(res.body).to.haveOwnProperty('status');
          expect(res.body.status).to.equal(200);
          expect(res.body).to.haveOwnProperty('data');
          expect(res.body.data).to.equal('approved');
          done();
        });
    });
    it('Should return details of the rejected travel request', (done) => {
      chai.request(server)
        .patch(`/api/v1/request/${travelRequestId}/status`)
        .set('Authorization', `Bearer ${lineManagerToken}`)
        .send({ approved: false })
        .end((err, res) => {
          // eslint-disable-next-line no-unused-expressions
          expect(err).to.be.null;
          expect(res).to.has.status(200);
          expect(res.body).to.haveOwnProperty('status');
          expect(res.body.status).to.equal(200);
          expect(res.body).to.haveOwnProperty('data');
          expect(res.body.data).to.equal('rejected');
          done();
        });
    });
    it('Should return an error if the approved parameter is missing', (done) => {
      chai.request(server)
        .patch(`/api/v1/request/${travelRequestId}/status`)
        .set('Authorization', `Bearer ${lineManagerToken}`)
        .end((err, res) => {
          // eslint-disable-next-line no-unused-expressions
          expect(err).to.be.null;
          expect(res).to.has.status(400);
          expect(res.body).to.haveOwnProperty('error');
          done();
        });
    });
    it('Should return an error if the approved parameter is not a boolean', (done) => {
      chai.request(server)
        .patch(`/api/v1/request/${travelRequestId}/status`)
        .set('Authorization', `Bearer ${lineManagerToken}`)
        .send({ approved: 1 })
        .end((err, res) => {
          // eslint-disable-next-line no-unused-expressions
          expect(err).to.be.null;
          expect(res).to.has.status(400);
          expect(res.body).to.haveOwnProperty('error');
          done();
        });
    });

describe('POST /api/v1/request', () => {
  it('Should successfully create a request', (done) => {
    chai
      .request(server)
      .post('/api/v1/request')
      .set('Authorization', `Bearer ${token}`)
      .send({
        passportName: 'okon chinedu',
        reason: 'to enjoy myself',
        managerId: 2,
        userId,
        type: 'one-way',
        from: 'Lagos',
        to: 'calabar',
        departureDate: '2018-03-29T13:34:00.000',
        accommodation: 'hotel presidential',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.status).to.be.equal(201);
        expect(res.body.data.trips).to.be.an('array');
        done();
      });
  });
  it('should return create request validation error', (done) => {
    chai
      .request(server)
      .post('/api/v1/request')
      .set('Authorization', `Bearer ${token}`)
      .send({
        passportName: '',
        reason: '',
        managerId: 2,
        userId,
        type: '',
        from: '',
        to: '',
        departureDate: '',
        accommodation: '',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });
  it('Should return an error if a one-way has more than one FROM entry' , (done) => {
    chai
      .request(server)
      .post('/api/v1/request')
      .set('Authorization', `Bearer ${token}`)
      .send({
        passportName: 'ngozi bayo',
        reason: 'to charge my phone',
        managerId: 2,
        userId,
        type: 'one-way',
        from: 'Lagos',
        from: 'osun',
        to: 'warri',
        departureDate: '2018-03-29T13:34:00.000',
        accommodation: 'hotel presidential',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.haveOwnProperty('error');
        done();
      });
  });
  it('Should return an error if a round-trip has more than one FROM entry' , (done) => {
    chai
      .request(server)
      .post('/api/v1/request')
      .set('Authorization', `Bearer ${token}`)
      .send({
        passportName: 'ngozi bayo',
        reason: 'to charge my phone',
        managerId: 2,
        userId,
        type: 'round-trip',
        from: 'Lagos',
        from: 'osun',
        to: 'warri',
        departureDate: '2018-03-29T13:34:00.000',
        arrivalDate: '2019-03-29T13:20:00.000',
        accommodation: 'hotel presidential',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.haveOwnProperty('error');
        done();
      });
  });
  it('Should return an error if a one-way trip has more than one TO entry' , (done) => {
    chai
      .request(server)
      .post('/api/v1/request')
      .set('Authorization', `Bearer ${token}`)
      .send({
        passportName: 'ngozi bayo',
        reason: 'to charge my phone',
        managerId: 2,
        userId,
        type: 'one-way',
        from: 'Lagos',
        to: 'warri',
        to: 'canada',
        departureDate: '2018-03-29T13:34:00.000',
        accommodation: 'hotel presidential',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.haveOwnProperty('error');
        done();
      });
  });
  it('Should return an error if a round-trip has more than one TO entry' , (done) => {
    chai
      .request(server)
      .post('/api/v1/request')
      .set('Authorization', `Bearer ${token}`)
      .send({
        passportName: 'ngozi bayo',
        reason: 'to charge my phone',
        managerId: 2,
        userId,
        type: 'round-trip',
        from: 'Lagos',
        to: 'warri',
        to: 'canada',
        departureDate: '2018-03-29T13:34:00.000',
        arrivalDate: '2019-03-29T13:20:00.000',
        accommodation: 'hotel presidential',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.haveOwnProperty('error');
        done();
      });
  });
  it('Should return an error if a one-way  has more than one DEPARTURE DATE entry' , (done) => {
    chai
      .request(server)
      .post('/api/v1/request')
      .set('Authorization', `Bearer ${token}`)
      .send({
        passportName: 'ngozi bayo',
        reason: 'to charge my phone',
        managerId: 2,
        userId,
        type: 'one-way',
        from: 'Lagos',
        to: 'warri',
        departureDate: '2018-03-29T13:34:00.000',
        departureDate: '2018-03-29T13:34:00.000',
        accommodation: 'hotel presidential',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.haveOwnProperty('error');
        done();
      });
  });
   it('Should return an error if a round-trip has more than one DEPARTURE DATE entry' , (done) => {
    chai
      .request(server)
      .post('/api/v1/request')
      .set('Authorization', `Bearer ${token}`)
      .send({
        passportName: 'ngozi bayo',
        reason: 'to charge my phone',
        managerId: 2,
        userId,
        type: 'one-way',
        from: 'Lagos',
        to: 'warri',
        departureDate: '2018-03-29T13:34:00.000',
        departureDate: '2018-03-29T13:34:00.000',
        arrivalDate: '2019-03-29T13:20:00.000',
        accommodation: 'hotel presidential',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.haveOwnProperty('error');
        done();
      });
  });
  it('Should return an error if a one-way trip has an ARRIVALDATE entry' , (done) => {
    chai
      .request(server)
      .post('/api/v1/request')
      .set('Authorization', `Bearer ${token}`)
      .send({
        passportName: 'ngozi bayo',
        reason: 'to charge my phone',
        managerId: 2,
        userId,
        type: 'one-way',
        from: 'Lagos',
        to: 'warri',
        departureDate: '2018-03-29T13:34:00.000',
        arrivalDate: '2018-03-29T13:34:00.000',
        accommodation: 'hotel presidential',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.haveOwnProperty('error');
        done();
      });
  });
  it('Should return an error if a round trip has more than one ARRIVALDATE entry' , (done) => {
    chai
      .request(server)
      .post('/api/v1/request')
      .set('Authorization', `Bearer ${token}`)
      .send({
        passportName: 'ngozi bayo',
        reason: 'to charge my phone',
        managerId: 2,
        userId,
        type: 'round-trip',
        from: 'Lagos',
        to: 'warri',
        departureDate: '2018-03-29T13:34:00.000',
        arrivalDate: '2018-03-29T13:34:00.000',
        arrivalDate: '2019-03-29T13:20:00.000',
        accommodation: 'hotel presidential',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.haveOwnProperty('error');
        done();
      });
  });
  it('Should return an error if a round trip has no ARRIVALDATE entry' , (done) => {
    chai
      .request(server)
      .post('/api/v1/request')
      .set('Authorization', `Bearer ${token}`)
      .send({
        passportName: 'ngozi bayo',
        reason: 'to charge my phone',
        managerId: 2,
        userId,
        type: 'round-trip',
        from: 'Lagos',
        to: 'warri',
        departureDate: '2018-03-29T13:34:00.000',
        accommodation: 'hotel presidential',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.haveOwnProperty('error');
        done();
      });
  });
  it('Should return an error if a multi-city trip has less than 2 FROM entries' , (done) => {
    chai
      .request(server)
      .post('/api/v1/request')
      .set('Authorization', `Bearer ${token}`)
      .send({
        passportName: 'ngozi bayo',
        reason: 'to charge my phone',
        managerId: 2,
        userId,
        type: 'multi-city',
        from: 'Lagos',
        to: 'warri',
        to: 'kogi',
        departureDate: '2018-03-29T13:34:00.000',
        departureDate: '2019-03-29T13:20:00.000',
        accommodation: 'hotel presidential',
        accommodation: 'my house',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.haveOwnProperty('error');
        done();
      });
  });
   it('Should return an error if a multi-city trip has less than 2 TO entries' , (done) => {
    chai
      .request(server)
      .post('/api/v1/request')
      .set('Authorization', `Bearer ${token}`)
      .send({
        passportName: 'ngozi bayo',
        reason: 'to charge my phone',
        managerId: 2,
        userId,
        type: 'multi-city',
        from: 'Lagos',
        from: 'warri',
        to: 'warri',
        departureDate: '2018-03-29T13:34:00.000',
        departureDate: '2019-03-29T13:20:00.000',
        accommodation: 'hotel presidential',
        accommodation: 'my house',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.haveOwnProperty('error');
        done();
      });
  });
   it('Should return an error if a multi-city trip has less than 2 DAPARTURE-DATE entries' , (done) => {
    chai
      .request(server)
      .post('/api/v1/request')
      .set('Authorization', `Bearer ${token}`)
      .send({
        passportName: 'ngozi bayo',
        reason: 'to charge my phone',
        managerId: 2,
        userId,
        type: 'multi-city',
        from: 'Lagos',
        from: 'warri',
        to: 'warri',
        to : 'togo',
        departureDate: '2018-03-29T13:34:00.000',
        accommodation: 'hotel presidential',
        accommodation: 'my house',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.haveOwnProperty('error');
        done();
      });
  });
});
