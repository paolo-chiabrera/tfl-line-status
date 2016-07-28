import {expect} from 'chai';
import sinon from 'sinon';

import _ from 'lodash';

import mapLineStatus from '../../lib/util/mapLineStatus';

import lineStatusParsedMock from '../mocks/line-status-parsed.mock';
import lineStatusMappedMock from '../mocks/line-status-mapped.mock';

describe('mapLineStatus', function () {
  it('should be defined', function () {
    expect(mapLineStatus).to.be.a('function');
  });

  it('should return if a callback is not passed', sinon.test(function () {
    const cb = this.spy();

    mapLineStatus('');

    sinon.assert.notCalled(cb);
  }));

  it('should raise the error to the callback: feed is not an Object', sinon.test(function () {
    const cb = this.spy();

    const feed = '';

    mapLineStatus(feed, cb);

    sinon.assert.calledWith(cb, 'feed is not an Object');
  }));

  it('should raise the error to the callback: ArrayOfLineStatus is not an Object', sinon.test(function () {
    const cb = this.spy();

    const feed = {};

    mapLineStatus(feed, cb);

    sinon.assert.calledWith(cb, 'ArrayOfLineStatus is not an Object');
  }));

  it('should raise the error to the callback: LineStatus is not an Array', sinon.test(function () {
    const cb = this.spy();

    const feed = {
      ArrayOfLineStatus: {}
    };

    mapLineStatus(feed, cb);

    sinon.assert.calledWith(cb, 'LineStatus is not an Array');
  }));

  it('should map an empty Array', sinon.test(function () {
    const cb = this.spy();

    const feed = {
      ArrayOfLineStatus: {
        LineStatus: []
      }
    };

    const feedMapped = [];

    mapLineStatus(feed, cb);

    sinon.assert.calledWith(cb, null, feedMapped);
  }));

  it('should catch any error from lodash mapping', sinon.test(function () {
    const cb = this.spy();

    const fakeErr = new Error('fake error');

    const map = this.stub(_, 'map', () => {
      throw fakeErr;
    });

    const feed = {
      ArrayOfLineStatus: {
        LineStatus: []
      }
    };

    mapLineStatus(feed, cb);

    sinon.assert.calledOnce(map);
    sinon.assert.calledOnce(cb);
    sinon.assert.calledWith(cb, fakeErr);
  }));

  it('should map multiple LineStatus correctly', sinon.test(function () {
    const cb = this.spy();

    mapLineStatus(lineStatusParsedMock, cb);

    sinon.assert.calledWith(cb, null, lineStatusMappedMock);
  }));
});
