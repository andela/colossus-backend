import { expect } from 'chai';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '..';

const api = request(app);
const token = jwt.sign({ id: 1}, 'secret');
const route = '/api/v1/auth/logout';

describe('/api/v1/auth/logout', () => {
  it('should respond with a 400 when auth header is absent', (done) => {
    api
      .post(route)
      .end((err, res) => {
        const { body, status } = res;
        expect(body).to.have.keys('error', 'status');
        expect(status).to.eql(400);
        done(err);
      });
  });
  it('should respond with a 401 or 200 depending on token validity', (done) => {
    api
      .post(route)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        const { status, body } = res;
        const isTrueAboutStatus = status === 401 || status === 200;
        const isTrueAboutBody = Object.keys(body).some((value) => {
          return value === 'data' || value === 'error';
        });
        expect(isTrueAboutStatus).to.be.true;
        expect(isTrueAboutBody).to.be.true;
        done(err);
      });
  });
});
