/* eslint-disable no-unused-expressions */
/* eslint-env mocha */

/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable linebreak-style */
import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import server from '../index';

dotenv.config();

const { expect } = chai;
chai.should();
chai.use(chaiHttp);

describe('Index', () => {
  it('Should return an object with properties "status" and "data" on success', (done) => {
    chai.request(server)
      .get('/')
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
});
