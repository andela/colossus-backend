import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import model from '../models';
import app from '..';

dotenv.config();

const url = '/api/v1/role/permissions';

const { User } = model;

chai.use(chaiHttp);

let token = null;

describe('PATCH /api/v1/role/permissions', () => {
  before((done) => {
    User.create({
      firstName: 'Alistair',
      lastName: 'Ferdinand',
      email: 'alistair@app.com',
      password: 'password',
      isVerified: true
    });
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
  describe('When the super admin wants to assign permissions to a role', () => {
    it('should return an error response when a resource endpoint is not supplied', (done) => {
      chai.request(app)
        .patch(url)
        .set('Authorization', `Bearer ${token}`)
        .send({
          role: 'manager',
          create: 'true',
          read: 'true',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });
    it('should return an error response when an invalid permmission value is supplied', (done) => {
      chai.request(app)
        .patch(url)
        .set('Authorization', `Bearer ${token}`)
        .send({
          role: 'manager',
          resource: 'user',
          create: 'yes',
          read: 'no',
          update: 'change',
          delete: 'delete',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });
    it('should respond with a 200 when a valid role, a valid resource and valid permissions are specified', (done) => {
      chai.request(app)
        .patch(url)
        .set('Authorization', `Bearer ${token}`)
        .send({
          role: 'manager',
          resource: 'user',
          create: true,
          read: true,
          update: true,
          delete: false
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
