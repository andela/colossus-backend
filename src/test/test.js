/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable linebreak-style */
import mocha from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../index';
import models from '../models';

const UserModel = models.User;

const { expect } = chai;

chai.use(chaiHttp);

describe('POST /api/v1/auth/signup', () => {
  describe('When all values in the POST body are the right format', () => {
    it('Should return an object with properties "status" and "data" on success', (done) => {
      chai.request(server)
        .post('/api/v1/auth/signup')
        .type('form')
        .send({
          firstName: 'James',
          lastName: 'Potter',
          email: 'JeanGray@hogwarts.com',
          password: 'expeliamus',
        })
        .end((err, res) => {
          // eslint-disable-next-line no-unused-expressions
          expect(err).to.be.null;
          expect(res).to.has.status(201);
          expect(res.body).to.be.a('object');
          expect(res.body).to.haveOwnProperty('status');
          expect(res.body.status).to.equal(201);
          expect(res.body).to.haveOwnProperty('data');
          expect(res.body.data).to.be.a('object');
          done();
        });
    });

    it('Should return an error if the email already exists', (done) => {
      chai.request(server)
        .post('/api/v1/auth/signup')
        .type('form')
        .send({
          firstName: 'James',
          lastName: 'Potter',
          email: 'JeanGray@hogwarts.com',
          password: 'expeliamus',
        })
        .end((err, res) => {
          // eslint-disable-next-line no-unused-expressions
          expect(err).to.be.null;
          expect(res).to.has.status(400);
          expect(res.body).to.be.a('object');
          expect(res.body).to.haveOwnProperty('status');
          expect(res.body.status).to.equal(400);
          expect(res.body).to.haveOwnProperty('error');
          expect(res.body.error).to.be.a('string');
          done();
        });
    });
  });
});

describe('POST /api/v1/auth/signin', () => {
  describe('When the user tries to login', () => {
    it('Should return an object with properties "status" and "data" on success', (done) => {
      chai.request(server)
        .post('/api/v1/auth/signin')
        .type('form')
        .send({
          email: 'JeanGray@hogwarts.com',
          password: 'expeliamus',
        })
        .end((err, res) => {
          // eslint-disable-next-line no-unused-expressions
          expect(err).to.be.null;
          expect(res).to.has.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.haveOwnProperty('status');
          expect(res.body.status).to.equal(200);
          expect(res.body).to.haveOwnProperty('data');
          expect(res.body.data).to.be.a('object');
          done();
        });
    });

    it('Should return an error if the email doesn\'t exist', (done) => {
      chai.request(server)
        .post('/api/v1/auth/signin')
        .type('form')
        .send({
          email: 'fake_student@hogwarts.com',
          password: 'expeliamus',
        })
        .end((err, res) => {
          // eslint-disable-next-line no-unused-expressions
          expect(err).to.be.null;
          expect(res).to.has.status(400);
          expect(res.body).to.be.a('object');
          expect(res.body).to.haveOwnProperty('status');
          expect(res.body.status).to.equal(400);
          expect(res.body).to.haveOwnProperty('error');
          expect(res.body.error).to.be.a('string');
          done();
        });
    });

    it('Should return an error if the password is incorrect', (done) => {
      chai.request(server)
        .post('/api/v1/auth/signin')
        .type('form')
        .send({
          email: 'JeanGray@hogwarts.com',
          password: 'wrong-password',
        })
        .end((err, res) => {
          // eslint-disable-next-line no-unused-expressions
          expect(err).to.be.null;
          expect(res).to.has.status(400);
          expect(res.body).to.be.a('object');
          expect(res.body).to.haveOwnProperty('status');
          expect(res.body.status).to.equal(400);
          expect(res.body).to.haveOwnProperty('error');
          expect(res.body.error).to.be.a('string');
          done();
        });
    });
  });
  after((done) => {
    UserModel.destroy({
      where: {
        email: 'JeanGray@hogwarts.com'
      }
    }).then(() => {
      done();
    });
  });
});
