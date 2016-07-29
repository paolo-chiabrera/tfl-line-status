import {expect} from 'chai';
import sinon from 'sinon';

import _ from 'lodash';

import main from '../../lib/modules/main';

import lineStatusParsedMock from '../mocks/line-status-parsed.mock';
import lineStatusMappedMock from '../mocks/line-status-mapped.mock';

describe('mapLineStatus', function () {

  let mapLineStatus = null;

  beforeEach(function () {
    mapLineStatus = sinon.spy(main, 'mapLineStatus');
  });

  afterEach(function () {
    mapLineStatus.restore();
  });

  it('should be defined', function () {
    expect(mapLineStatus).to.be.a('function');
  });

  it('should throw the error: feed is not an Object', function () {
    const err = new Error('feed is not an Object');

    try {
      mapLineStatus();
    } catch (e) {
      expect(e).to.eql(err);
    }
  });

  it('should throw the error: feed is not an Object', function () {
    const err = new Error('feed is not an Object');

    try {
      mapLineStatus(null);
    } catch (e) {
      expect(e).to.eql(err);
    }
  });

  it('should throw the error: ArrayOfLineStatus is not an Object', function () {
    const err = new Error('ArrayOfLineStatus is not an Object');

    try {
      mapLineStatus({});
    } catch (e) {
      expect(e).to.eql(err);
    }
  });

  it('should throw the error: LineStatus is not an Array', function () {
    const err = new Error('LineStatus is not an Array');

    const feed = {
      ArrayOfLineStatus: {}
    };

    try {
      mapLineStatus(feed);
    } catch (e) {
      expect(e).to.eql(err);
    }
  });

  it('should map an empty Array', function () {
    const feed = {
      ArrayOfLineStatus: {
        LineStatus: []
      }
    };

    const feedMapped = mapLineStatus(feed);

    expect(feedMapped).to.eql([]);
  });

  it('should catch any error from lodash mapping', sinon.test(function () {
    const fakeErr = new Error('fake error');

    const map = this.stub(_, 'map', () => {
      throw fakeErr;
    });

    const feed = {
      ArrayOfLineStatus: {
        LineStatus: []
      }
    };

    try {
      mapLineStatus(feed);
    } catch (e) {
      sinon.assert.calledOnce(map);
      expect(e).to.eql(fakeErr);
    }
  }));

  it('should map multiple LineStatus correctly', function () {
    const feedMapped = mapLineStatus(lineStatusParsedMock);

    expect(feedMapped).to.eql(lineStatusMappedMock);
  });
});
