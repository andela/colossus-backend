/* eslint-disable no-unused-expressions */
import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import server from '../index';
import models from '../models';

dotenv.config();

const { User } = models;

const UserModel = User;

const { expect } = chai;
chai.should();
chai.use(chaiHttp);

before((done) => {
  User.create({
    firstName: 'ileriayo',
    lastName: 'adebiyi',
    email: 'ileri@nomad.com',
    password: 'password',
    isVerified: true
  });
  done();
});
describe('POST /api/v1/auth/signin', () => {
  describe('When the user tries to login', () => {
    it('Should return an object with properties "status" and "data" on success', (done) => {
      chai.request(server)
        .post('/api/v1/auth/signin')
        .type('form')
        .send({
          email: 'ileri@nomad.com',
          password: 'password',
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.has.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.haveOwnProperty('status');
          expect(res.body.status).to.equal(200);
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
          expect(err).to.be.null;
          expect(res).to.has.status(400);
          expect(res.body).to.be.a('object');
          expect(res.body).to.haveOwnProperty('status');
          expect(res.body.status).to.equal(400);
          expect(res.body).to.haveOwnProperty('error');
          done();
        });
    });

    it('Should return an error if the password is incorrect', (done) => {
      chai.request(server)
        .post('/api/v1/auth/signin')
        .type('form')
        .send({
          email: 'ileri@nomad.com',
          password: 'wrong-password',
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.has.status(400);
          expect(res.body).to.be.a('object');
          expect(res.body).to.haveOwnProperty('status');
          expect(res.body.status).to.equal(400);
          done();
        });
    });


    it('Should return an error if the email is not provided', (done) => {
      chai.request(server)
        .post('/api/v1/auth/signin')
        .type('form')
        .send({
          email: '',
          password: 'expeliamus',
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body.status).to.equal('error');
          done();
        });
    });
  });

  after((done) => {
    UserModel.destroy({
      where: {
        email: 'ileri@nomad.com'
      }
    }).then(() => {
      done();
    });
  });
});
