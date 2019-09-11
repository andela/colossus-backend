import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../index';
import models from '../models';

let verifierToken;
const { User } = models;

const { expect } = chai;
chai.should();
chai.use(chaiHttp);

describe('GET /auth/verifyuser', () => {
  it('Sign up this user for verfication', (done) => {
    chai.request(server)
      .post('/api/v1/auth/signup')
      .type('form')
      .send({
        firstName: 'Sergio',
        lastName: 'Femi',
        email: 'femoral@domain.com',
        password: 'testify123',
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

        verifierToken = res.body.data.token;
        done();
      });
  });
  it('Should send a verification Mail to the client', (done) => {
    chai.request(server)
      .get(`/api/v1/auth/verifyuser?query=${verifierToken}`)
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
    verifierToken = '';
    chai.request(server)
      .get(`/api/v1/auth/verifyuser?query=${verifierToken}`)
      .end((err, res) => {
        expect(res.body).to.be.a('object');
        expect(res.body.status).to.equal('error');
        done();
      });
  });

  after((done) => {
    User.destroy({
      where: {
        email: 'femoral@domain.com'
      }
    })
      .then(() => {
        done();
      });
  });
});
