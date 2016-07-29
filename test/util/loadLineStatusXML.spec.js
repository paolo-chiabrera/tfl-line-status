import {expect} from 'chai';
import sinon from 'sinon';

import needle from 'needle';

import loadLineStatusXML from '../../lib/modules/loadLineStatusXML';

describe('loadLineStatusXML', function () {
  it('should be defined', function () {
    expect(loadLineStatusXML).to.be.a('function');
  });

  it('should return if a callback is not passed', sinon.test(function () {
    const get = this.spy(needle, 'get');

    loadLineStatusXML();

    sinon.assert.notCalled(get);
  }));

  it('should call needle.get if a callback is passed', sinon.test(function () {
    const get = this.spy(needle, 'get');

    loadLineStatusXML(() => {});

    sinon.assert.calledOnce(get);
  }));

  it('should call needle.get and raise a generic error', sinon.test(function () {
    const cb = this.spy();

    const fakeErr = new Error('fake error');

    const get = this.stub(needle, 'get', (feedUrl, options, cb) => {
      cb(fakeErr);
    });

    loadLineStatusXML(cb);

    sinon.assert.calledOnce(get);
    sinon.assert.calledOnce(cb);
    sinon.assert.calledWith(cb, fakeErr);
  }));

  it('should call needle.get and raise wrong statusCode error', sinon.test(function () {
    const cb = this.spy();

    const statusCode = 404;
    const errMsg = 'wrong statusCode ' + statusCode;

    const get = this.stub(needle, 'get', (feedUrl, options, cb) => {
      cb(null, {
        statusCode: statusCode
      });
    });

    loadLineStatusXML(cb);

    sinon.assert.calledOnce(get);
    sinon.assert.calledOnce(cb);
    sinon.assert.calledWith(cb, errMsg);
  }));

  it('should call needle.get and succeed', sinon.test(function () {
    const cb = this.spy();

    const response = {
      statusCode: 200,
      body: '<test></test>'
    };

    const get = this.stub(needle, 'get', (feedUrl, options, cb) => {
      cb(null, response);
    });

    loadLineStatusXML(cb);

    sinon.assert.calledOnce(get);
    sinon.assert.calledOnce(cb);
    sinon.assert.calledWith(cb, null, response.body);
  }));
});
