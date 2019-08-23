/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable linebreak-style */
import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import server from '../index';
import models from '../models';

dotenv.config();

const { User } = models;

const UserModel = User;

const { expect } = chai;
chai.use(chaiHttp);

let emailToken;
let verificationToken;

const root = '/api/v1';

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

          verificationToken = res.body.data.token;
          done();
        });
    });

    it('Should send a verification Mail to the client', (done) => {
      chai.request(server)
        .post(`/api/v1/auth/verifyuser?query=${verificationToken}`)
        .end((err, res) => {
          expect(res).to.has.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.haveOwnProperty('status');
          expect(res.body.status).to.equal('success');
          expect(res.body).to.haveOwnProperty('message');
          done();
        });
    });
    it('Should RETURN  if no verificationToken is provided', (done) => {
      verificationToken = '';
      chai.request(server)
        .post(`/api/v1/auth/verifyuser?query=${verificationToken}`)
        .end((err, res) => {
          expect(res.body).to.be.a('object');
          expect(res.body.status).to.equal('error');
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

describe('POST /api/v1/auth/sendEmail', () => {
  before((done) => {
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'Iyara',
        lastName: 'Ferguson',
        email: 'iyaraferguson@gmail.com',
        password: 'Password@2017'
      }).then(() => {
        done();
      });
  });
  describe('Should send an email if the requesting user is registered on barefoot nomad', () => {
    it('Should successfully send a password reset mail', (done) => {
      chai.request(server)
        .post('/api/v1/auth/sendEmail')
        .send({
          email: 'iyaraferguson@gmail.com'
        })
        .end((err, res) => {
          emailToken = res.body.data.token;
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal(200);
          expect(res.body.data).to.have.key('message', 'token');
          expect(res.body.data.token).to.be.a('string');
          done();
        });
    });
    it('Should throw an error if the user is not registered', (done) => {
      chai.request(server)
        .post('/api/v1/auth/sendEmail')
        .send({
          email: 'socrates2@gmail.com'
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.equal(404);
          expect(res.body.error).to.be.a('string');
          expect(res.body.error).to.be.equal('No User with the provided email');
          done();
        });
    });
    it('Should throw an error if no email is supplied', (done) => {
      chai.request(server)
        .post('/api/v1/auth/sendEmail')
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.a('string');
          expect(res.body.error).to.be.equal('Your email is required');
          done();
        });
    });
    it('Should throw an error if the user inputs an invalid email', (done) => {
      chai.request(server)
        .post('/api/v1/auth/sendEmail')
        .send({
          email: 'socrates2gmail.com'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.a('string');
          expect(res.body.error).to.be.equal('Invalid email supplied');
          done();
        });
    });
  });
});

describe('POST /api/v1/auth/resetPassword', () => {
  describe('Password reset endpoint', () => {
    it('Should successfully reset the password of a registered user', (done) => {
      chai.request(server)
        .post(`/api/v1/auth/resetPassword?query=${emailToken}`)
        .send({
          password: 'Password@2018',
          confirmPassword: 'Password@2018'
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal(200);
          expect(res.body.data).to.have.key('message');
          expect(res.body.data.message).to.be.equal('Password reset successful');
          done();
        });
    });
    it('Should throw an error if no token is present', (done) => {
      chai.request(server)
        .post('/api/v1/auth/resetPassword')
        .send({
          password: 'Password@2018',
          confirmPassword: 'Password@2018'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.a('string');
          expect(res.body.error).to.be.equal('You do not have rights to this resource');
          done();
        });
    });
    it('Should throw an error if no token is malformed', (done) => {
      chai.request(server)
        .post('/api/v1/auth/resetPassword?query=emailToken')
        .send({
          password: 'Password@2018',
          confirmPassword: 'Password@2018'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.a('string');
          done();
        });
    });
    it('Should throw an error if the password and confirm password do not match', (done) => {
      chai.request(server)
        .post(`/api/v1/auth/resetPassword?query=${emailToken}`)
        .send({
          password: 'Pasword@2018',
          confirmPassword: 'Password@2018'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.a('string');
          expect(res.body.error).to.be.equal('password and confirm password are not the same');
          done();
        });
    });
    it('Should throw an error if the password contains whitespace', (done) => {
      chai.request(server)
        .post(`/api/v1/auth/resetPassword?query=${emailToken}`)
        .send({
          password: 'Password@ 2018',
          confirmPassword: 'Password@ 2018'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.a('string');
          expect(res.body.error).to.be.equal('Password must not contain whitesepace');
          done();
        });
    });
    it('Should throw an error if user fails to include the password or confirm password', (done) => {
      chai.request(server)
        .post(`/api/v1/auth/resetPassword?query=${emailToken}`)
        .send({
          password: 'Password@2018'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.a('string');
          expect(res.body.error).to.be.equal('password and confirm password are required');
          done();
        });
    });
    it('Should throw an error if the password and confirm password do not match', (done) => {
      chai.request(server)
        .post(`/api/v1/auth/resetPassword?query=${emailToken}`)
        .send({
          password: 'Password@2018',
          confirmPassword: 'Password@018'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.a('string');
          expect(res.body.error).to.be.equal('password and confirm password are not the same');
          done();
        });
    });
    it('Should throw an error if the password does not contain at least one lower case letter', (done) => {
      chai.request(server)
        .post(`/api/v1/auth/resetPassword?query=${emailToken}`)
        .send({
          password: 'PASSWORD@2018',
          confirmPassword: 'PASSWORD@2018',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.a('string');
          expect(res.body.error).to.be.equal('Password must contain at least one lower case character');
          done();
        });
    });
    it('Should throw an error if the password does not contain at least one upper case letter', (done) => {
      chai.request(server)
        .post(`/api/v1/auth/resetPassword?query=${emailToken}`)
        .send({
          password: 'password@2018',
          confirmPassword: 'password@2018',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.a('string');
          expect(res.body.error).to.be.equal('Password must contain at least one upper case character');
          done();
        });
    });
    it('Should throw an error if the password does not contain at least one number', (done) => {
      chai.request(server)
        .post(`/api/v1/auth/resetPassword?query=${emailToken}`)
        .send({
          password: 'Password@salami',
          confirmPassword: 'Password@salami',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.a('string');
          expect(res.body.error).to.be.equal('Password must contain at least one number');
          done();
        });
    });
    it('Should throw an error if the password does not contain at least one special character', (done) => {
      chai.request(server)
        .post(`/api/v1/auth/resetPassword?query=${emailToken}`)
        .send({
          password: 'Password2018',
          confirmPassword: 'Password2018',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.a('string');
          expect(res.body.error).to.be.equal('Password must contain at least one special case character');
          done();
        });
    });
    it('Should throw an error if the password is less than 8 characters', (done) => {
      chai.request(server)
        .post(`/api/v1/auth/resetPassword?query=${emailToken}`)
        .send({
          password: 'Pass@2',
          confirmPassword: 'Pass@2',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.error).to.be.a('string');
          expect(res.body.error).to.be.equal('Password must contain at least 8 characters');
          done();
        });
    });
  });
  after((done) => {
    UserModel.destroy({
      where: {
        email: 'iyaraferguson@gmail.com'
      }
    }).then(() => {
      done();
    });
  });
});

describe('POST /api/v1/auth/logout', () => {
  before((done) => {
    UserModel.create({
      email: 'jacky@app.com',
      firstName: 'Jacky',
      lastName: 'Elmsworth',
      password: 'sillblixt'
    })
      .then((user) => {
        verificationToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
        done();
      });
  });
  it('should respond with a 400 if auth header is absent', (done) => {
    chai
      .request(server)
      .post(`${root}/auth/logout`)
      .end((err, res) => {
        const { status, body } = res;
        const isTrueAboutBody = Object.keys(body).some((value) => value === 'error');
        expect(status).to.be.eql(400);
        expect(isTrueAboutBody).to.be.eql(true);
        done();
      });
  });
  it('should respond with a 401 if token is absent', (done) => {
    chai
      .request(server)
      .post(`${root}/auth/logout`)
      .set('Authorization', 'Bearer')
      .end((err, res) => {
        const { status, body } = res;
        const isTrueAboutBody = Object.keys(body).some((value) => value === 'error');
        expect(isTrueAboutBody).to.be.eql(true);
        expect(status).to.be.eql(401);
        done();
      });
  });
  it('should respond with a 200 when a valid token is sent', (done) => {
    chai
      .request(server)
      .post(`${root}/auth/logout`)
      .set('Authorization', `Bearer ${verificationToken}`)
      .end((err, res) => {
        const { status, body } = res;
        const isTrueAboutBody = Object.keys(body).some((value) => value === 'data');
        expect(status).to.be.eql(200);
        expect(isTrueAboutBody).to.be.eql(true);
        expect(body.data).to.be.a('string');
        done();
      });
  });
  after((done) => {
    UserModel.destroy({
      where: {
        email: 'jacky@app.com'
      }
    })
      .then(() => {
        done();
      });
  });
});
