import {expect} from 'chai';

import util from '../../lib/modules/main';

describe('main', function () {
  it('should be defined', function () {
    expect(util).to.be.a('object');
  });

  it('should expose: loadLineStatusXML', function () {
    expect(util.loadLineStatusXML).to.be.a('function');
  });

  it('should expose: mapLineStatus', function () {
    expect(util.mapLineStatus).to.be.a('function');
  });

  it('should expose: mapCode', function () {
    expect(util.mapCode).to.be.an('object');
  });
});
