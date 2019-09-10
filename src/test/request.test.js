/* eslint-disable no-dupe-keys */
import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import server from '../index';
import models from '../models';
import helper from '../helpers/jwtHelper';

const { generateToken } = helper;

let userId;
let token;
let oneTimeToken;

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
  });
});

describe('POST /api/v1/request', () => {
  before((done) => {
    // Verify the newly created user
    chai.request(server)
      .get(`/api/v1/auth/verifyuser?query=${token}`)
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });
  before((done) => {
    // Edit the line manager id of the new user
    chai.request(server)
      .patch('/api/v1/auth/edit')
      .set('Authorization', `Bearer ${token}`)
      .send({
        gender: 'male',
        lineManagerId: 1
      })
<<<<<<< HEAD
<<<<<<< HEAD
      // eslint-disable-next-line no-unused-vars
      .end((err, res) => {
=======
      .end((err, res) => {
        if (err) console.log(err);
        if (res) console.log(res);
>>>>>>> feat(edit-request)
=======
      // eslint-disable-next-line no-unused-vars
      .end((err, res) => {
>>>>>>> feat(edit-request): Create and endpoint for a user to edit the details of a request
        done();
      });
  });
  it('Should successfully create a request', (done) => {
    chai
      .request(server)
      .post('/api/v1/request')
      .set('Authorization', `Bearer ${token}`)
      .send({
        passportName: 'John Doe',
        reason: 'Work leave',
        type: 'one-way',
        from: ['New york'],
        to: ['London'],
        departureDate: ['2018-03-29T13:34:00.000'],
        accommodation: ['Burj Al-Arab']
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        userId = res.body.data.id;
        expect(res.body.status).to.be.equal(201);
        expect(res.body.data.trips).to.be.an('array');
        done();
      });
  });
  it('Should return an error if the user does not include any of the required information', (done) => {
    chai
      .request(server)
      .post('/api/v1/request')
      .set('Authorization', `Bearer ${token}`)
      .send({
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.an('array');
        done();
      });
  });
  it('Should return an error if any of the trip\'s details is not an array', (done) => {
    chai
      .request(server)
      .post('/api/v1/request')
      .set('Authorization', `Bearer ${token}`)
      .send({
        passportName: 'John',
        reason: 'Work',
        type: 'round-trip',
        from: 'Dubai',
        to: 'London',
        departureDate: '2018-03-29T13:34:00.000',
        arrivalDate: '2018-03-29T13:34:00.000',
        accommodation: 'Burj Al-Arab'
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.an('array');
        done();
      });
  });
  it('Should return an error if the user does not include an arrival date for a round-trip request', (done) => {
    chai
      .request(server)
      .post('/api/v1/request')
      .set('Authorization', `Bearer ${token}`)
      .send({
        passportName: 'John Doe',
        reason: 'Work leave',
        type: 'round-trip',
        from: ['London'],
        to: ['Dubai'],
        departureDate: ['2018-03-29T13:34:00.000'],
        accommodation: ['Burj Al-Arab']
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.an('array');
        done();
      });
  });
  it('Should return an error if the type is not valid', (done) => {
    chai
      .request(server)
      .post('/api/v1/request')
      .set('Authorization', `Bearer ${token}`)
      .send({
        passportName: 'John Doe',
        reason: 'Work leave',
        type: 'two-cities',
        from: ['London'],
        to: ['Dubai'],
        departureDate: ['2018-03-29T13:34:00.000'],
        arrivalDate: ['2018-03-29T13:34:00.000'],
        accommodation: ['Burj Al-Arab']
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.an('array');
        done();
      });
  });
  it('Should return an error if any of the trip\'s details is incorrect', (done) => {
    chai
      .request(server)
      .post('/api/v1/request')
      .set('Authorization', `Bearer ${token}`)
      .send({
        passportName: 'John Doe',
        reason: 'Work leave',
        type: 'one-way',
        from: [2],
        to: [2],
        departureDate: [2],
        accommodation: ['Burj']
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.an('array');
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
        userId,
        type: '',
        from: '',
        to: '',
        departureDate: '',
        accommodation: '',
      })
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.an('array');
        done();
      });
  });
  it('Should return an error if a one-way trip has an ARRIVALDATE', (done) => {
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
        from: ['Lagos'],
        to: ['warri'],
        departureDate: ['2018-03-29T13:34:00.000'],
        arrivalDate: ['2019-03-29T13:20:00.000'],
        accommodation: ['hotel presidential'],
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.haveOwnProperty('error');
        done();
      });
  });
  it('Should return an error if a round-trip has no ARRIVALDATE ', (done) => {
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
        from: ['Lagos'],
        to: ['warri'],
        departureDate: ['2018-03-29T13:34:00.000'],
        accommodation: ['hotel presidential'],
      })
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.an('array');
        done();
      });
  });
  it('Should return an error if the round-trip arrival date is invalid', (done) => {
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
        from: ['Lagos'],
        to: ['warri'],
        departureDate: ['2018-03-29T13:34:00.000'],
        arrivalDate: [20],
        accommodation: ['hotel presidential'],
      })
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.an('array');
        done();
      });
  });
  it('Should return an error if a multi-city trip has less than 2 ACCOMODATION entries', (done) => {
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
        from: ['Lagos', 'warri'],
        to: ['warri', 'kogi'],
        departureDate: ['2018-03-29T13:34:00.000', '2019-03-29T13:20:00.000'],
        accommodation: ['hotel presidential']
      })
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.an('array');
        done();
      });
  });
  it('Should return an error if a multi-city trip has less than 2 DAPARTURE-DATE entries', (done) => {
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
        from: ['Lagos', 'warri'],
        to: ['warri', 'kogi'],
        departureDate: ['2018-03-29T13:34:00.000'],
        accommodation: ['hotel presidential', 'my house']
      })
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.an('array');
        done();
      });
  });
  it('Should return an error if a multi-city trip has less than 2 FROM entries', (done) => {
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
        from: ['Lagos'],
        to: ['warri', 'kogi'],
        departureDate: ['2018-03-29T13:34:00.000', '2019-03-29T13:20:00.000'],
        accommodation: ['hotel presidential', 'my house']
      })
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.an('array');
        done();
      });
  });
  it('Should return an error if a multi-city trip has less than 2 TO entries', (done) => {
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
        from: ['Lagos', 'warri'],
        to: ['warri'],
        departureDate: ['2018-03-29T13:34:00.000', '2019-03-29T13:20:00.000'],
        accommodation: ['hotel presidential', 'my house']
      })
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.an('array');
        done();
      });
  });
  it('Should return an error if a multi-city trip has an ARRIVALDATE entry', (done) => {
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
        from: ['Lagos', 'warri'],
        to: ['warri', 'togo'],
        departureDate: ['2018-03-29T13:34:00.000', '2019-03-29T13:20:00.000'],
        arrivalDate: ['2019-03-29T13:20:00.000'],
        accommodation: ['hotel presidential', 'my house']
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.haveOwnProperty('error');
        done();
      });
  });
  before((done) => {
    // Sign up a user to get a token to use for the protected route
    chai.request(server)
      .post('/api/v1/auth/signup')
      .type('form')
      .send({
        firstName: 'Iyara',
        lastName: 'Ferguson',
        email: 'fegzyson@colossus.com',
        password: 'expeliamus',
      })
      .end((err, res) => {
        oneTimeToken = res.body.data.token;
        done();
      });
  });
  it('Should return an error if the line manager ID is not found ', (done) => {
    chai
      .request(server)
      .post('/api/v1/request')
      .set('Authorization', `Bearer ${oneTimeToken}`)
      .send({
        passportName: 'John Doe',
        reason: 'Work leave',
        type: 'one-way',
        from: ['New york'],
        to: ['London'],
        departureDate: ['2018-03-29T13:34:00.000'],
        accommodation: ['Burj Al-Arab']
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.be.equal('Line manager not found, edit your profile and try again');
        done();
      });
  });
});

describe('PATCH /api/v1/request/:id', () => {
  it('Should successfully edit a request with a status of open', (done) => {
    chai
      .request(server)
      .patch(`/api/v1/request/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        passportName: 'John Doe',
        reason: 'Pilgrimage',
        type: 'one-way',
        from: ['Dubai'],
        to: ['London'],
        departureDate: ['2018-03-29T13:34:00.000'],
        accommodation: ['Burj Al-Arab'],
        id: [userId]
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal(200);
        expect(res.body.data.trips).to.be.an('array');
        done();
      });
  });
  it('Should return an error if the id to be edited is not a valid id', (done) => {
    chai
      .request(server)
      .patch(`/api/v1/request/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        passportName: 'John Doe',
        reason: 'Pilgrimage',
        type: 'one-way',
        from: ['Dubai'],
        to: ['London'],
        departureDate: ['2018-03-29T13:34:00.000'],
        accommodation: ['Burj Al-Arab'],
        id: ['fake id']
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.an('array');
        done();
      });
  });
  it('Should return an error if the id to be edited is not an array', (done) => {
    chai
      .request(server)
      .patch(`/api/v1/request/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        passportName: 'John Doe',
        reason: 'Pilgrimage',
        type: 'one-way',
        from: ['Dubai'],
        to: ['London'],
        departureDate: ['2018-03-29T13:34:00.000'],
        accommodation: ['Burj Al-Arab'],
        id: 2
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.be.an('array');
        done();
      });
  });
});
