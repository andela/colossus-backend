import { expect } from 'chai';

describe('true or false', () => {
  // Just to verify that test is setup
  // It should be removed before the first feature is implemented
  it('true is true', () => {
    expect(true).to.eql(true);
  });

  it('false is false', () => {
    expect(false).to.eql(false);
  });
});