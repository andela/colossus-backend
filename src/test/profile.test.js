import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import model from '../models';
import app from '..';

dotenv.config();

const url = '/api/v1/auth/edit';

const { User } = model;

chai.use(chaiHttp);

let token = null;

describe('PATCH /api/v1/auth/edit', () => {
  before((done) => {
    User.create({
      firstName: 'Alistair',
      lastName: 'Ferdinand',
      email: 'alistair@app.com',
      password: 'password',
      isVerified: true
    })
      .then((user) => {
        token = jwt.sign({
          email: user.email,
          id: user.id
        }, process.env.JWT_SECRET);
        done();
      });
  });
  describe('When a user wants to edit their profile', () => {
    it('should respond with a 401 when no token is sent', (done) => {
      chai.request(app)
        .patch(url)
        .set('Authorization', 'Bearer')
        .send({
          gender: 'male',
          lineManagerId: 1
        })
        .end((err, res) => {
          const { status, body } = res;
          const isTrueAboutBody = Object.keys(body).some((key) => key === 'error');
          expect(status).to.be.equal(401);
          expect(isTrueAboutBody).to.be.equal(true);
          done();
        });
    });
    it('should respond with a 200 when token is sent', (done) => {
      chai.request(app)
        .patch(url)
        .set('Authorization', `Bearer ${token}`)
        .send({
          gender: 'male',
          currency: 'GBP',
          language: 'ESP',
          department: 'Information technology'
        })
        .end((err, res) => {
          const { status, body } = res;
          const isTrueAboutBody = Object.keys(body).some((key) => key === 'data');
          expect(status).to.be.equal(200);
          expect(isTrueAboutBody).to.be.equal(true);
          done();
        });
    });
  });
});
