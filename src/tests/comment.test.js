import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../index';
import models from '../models';
import helper from '../helpers/jwtHelper';

const { generateToken } = helper;

let userId;
let requestId;
let firstToken;
let secondToken;

const {
  Request,
  Trip,
  User
} = models;

const { expect } = chai;
chai.should();
chai.use(chaiHttp);

const secondSignup = {
  firstName: 'Fred',
  lastName: 'Noble',
  email: 'besta@domain.com',
  password: 'tester123',
  isVerified: true
};

before((done) => {
  // Create lineManager user
  User.create({
    firstName: 'John',
    lastName: 'Neo',
    email: 'testy@domain.com',
    password: 'tester123',
    isVerified: true
  }).then((user) => {
    userId = user.id;
    firstToken = generateToken({
      id: userId,
      email: user.email,
      isVerified: user.isVerified
    });
    User.create(secondSignup)
      .then((user2) => {
        secondToken = generateToken({
          id: user2.id,
          email: user2.email,
          isVerified: user2.isVerified
        });
      });

    Request.create({
      userId,
      passportName: 'normal User',
      reason: 'test reason',
      lineManagerId: 1,
      status: 'pending',
      type: 'one-way',
    }).then((newRequest) => {
      requestId = newRequest.id;
      Trip.create({
        requestId,
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
before((done) => {
  // Edit the line manager id of the new user
  chai.request(server)
    .patch('/api/v1/auth/edit')
    .set('Authorization', `Bearer ${firstToken}`)
    .send({
      gender: 'male',
      lineManagerId: 1
    })
    // eslint-disable-next-line no-unused-vars
    .end((err, res) => {
      done();
    });
});
describe('POST /request/:requestId/comment, Creating a new newcomment', () => {
  it('Should return details of the new comments on a request', (done) => {
    chai.request(server)
      .post(`/api/v1/request/${requestId}/comment`)
      .set('Authorization', `Bearer ${firstToken}`)
      .send({
        commentBody: 'This is the comment',
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

  // send a second comment
  it('Should return details of the second comment on a request', (done) => {
    chai.request(server)
      .post(`/api/v1/request/${requestId}/comment`)
      .set('Authorization', `Bearer ${firstToken}`)
      .send({
        commentBody: 'second comment, this comment\'s deleted-at column sould be null ',
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
      .post(`/api/v1/request/${requestId}/comment`)
      .set('Authorization', `Bearer ${firstToken}`)
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
      .post(`/api/v1/request/${requestId}/comment`)
      .set('Authorization', `Bearer ${firstToken}`)
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

describe('PATCH /request/requestId/comment/commentId, editing a comment', () => {
  it('Should allow a users ability to edit their posted comments', (done) => {
    chai.request(server)
      .patch(`/api/v1/request/${requestId}/comment/2`)
      .set('Authorization', `Bearer ${firstToken}`)
      .send({
        commentBody: 'Am the second comment, and i\'ve been patched! anyhow'
      })
      .end((err, res) => {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be.null;
        expect(res).to.has.status(200);
        expect(res.body).to.haveOwnProperty('status');
        expect(res.body.status).to.equal('success');
        expect(res.body).to.haveOwnProperty('data');
        done();
      });
  });

  it('Should NOT allow a user ability to edit another user\'s posted comments', (done) => {
    chai.request(server)
      .patch(`/api/v1/request/${requestId}/comment/2`)
      .set('Authorization', `Bearer ${secondToken}`)
      .send({
        commentBody: 'Am an impostor trying to patch the second comment'
      })
      .end((err, res) => {
        // eslint-disable-next-line no-unused-expressions
        expect(res).to.has.status(404);
        expect(res.body).to.haveOwnProperty('status');
        done();
      });
  });
});

describe('PSEUDO-delete /request/:requestId/comment/commentId', () => {
  it('Should NOT ALLOW a user to delete another user\'s comment', (done) => {
    chai.request(server)
      .delete(`/api/v1/request/${requestId}/comment/1`)
      .set('Authorization', `Bearer ${secondToken}`)
      .end((err, res) => {
      // eslint-disable-next-line no-unused-expressions
        expect(res).to.has.status(401);
        expect(res.body).to.haveOwnProperty('status');
        expect(res.body.status).to.equal('error');
        expect(res.body.message).to.equal('you are not the owner of this comment');
        done();
      });
  });

  it('Should set DeletedAt column to current date and time', (done) => {
    chai.request(server)
      .delete(`/api/v1/request/${requestId}/comment/1`)
      .set('Authorization', `Bearer ${firstToken}`)
      .end((err, res) => {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be.null;
        expect(res).to.has.status(200);
        expect(res.body).to.haveOwnProperty('status');
        expect(res.body.status).to.equal('success');
        expect(res.body).to.haveOwnProperty('data');
        done();
      });
  });
});

describe('GET /request/:requestId/comment', () => {
  it('Should return all comments in the database related to a request', (done) => {
    chai.request(server)
      .get(`/api/v1/request/${requestId}/comment`)
      .set('Authorization', `Bearer ${firstToken}`)
      .end((err, res) => {
        // eslint-disable-next-line no-unused-expressions
        const notdeleted = res.body.data[0].deletedAt;
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be.null;
        expect(res).to.has.status(200);
        expect(res.body).to.haveOwnProperty('status');
        expect(res.body.status).to.equal('success');
        expect(notdeleted).to.equal(null);
        expect(res.body).to.haveOwnProperty('data');
        expect(res.body.data).to.be.a('array');
        expect(res.body.data[0]).to.haveOwnProperty('commentBody');
        expect(res.body.data[0]).to.haveOwnProperty('requestId');
        expect(res.body.data[0]).to.haveOwnProperty('userId');
        done();
      });
  });
});
