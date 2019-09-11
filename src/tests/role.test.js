import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import model from '../models';
import app from '..';

dotenv.config();

const url = '/api/v1/role';

const { User } = model;

chai.use(chaiHttp);

let token = null;

describe('PATCH /api/v1/role', () => {
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
  describe('When a user who is not the super admin wants to assign roles to users', () => {
    it('should return an error response if the user is not an admin', (done) => {
      chai.request(app)
        .patch(url)
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'alistair@app.com',
          role: 'manager'
        })
        .end((err, res) => {
          expect(res).to.have.status(403);
          done();
        });
    });
  });
});

describe('PATCH /api/v1/role', () => {
  before((done) => {
    User.findOne({
      where: { role: 'super_admin' }
    })
      .then((user) => {
        token = jwt.sign({
          email: user.email,
          id: user.id
        }, process.env.JWT_SECRET);
        done();
      });
  });
  describe('When the super admin wants to assign a role to a user', () => {
    it('should return an error response when an invalid email is supplied', (done) => {
      chai.request(app)
        .patch(url)
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'xxyyzz@fake.com',
          role: 'manager'
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
    it('should return an error response when an invalid role is supplied', (done) => {
      chai.request(app)
        .patch(url)
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'alistair@app.com',
          role: 'banker'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });
    it('should respond with a 200 when role and email is specified', (done) => {
      chai.request(app)
        .patch(url)
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'alistair@app.com',
          role: 'manager'
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
    after((done) => {
      User.destroy({
        where: { email: 'alistair@app.com' }
      });
      done();
    });
  });
});
