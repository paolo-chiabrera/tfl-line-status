import {expect} from 'chai';
import sinon from 'sinon';

import async from 'async';
import Q from 'q';

import TflLineStatus from '../lib/index';
import util from '../lib/util/main';

import lineStatusParsedMock from './mocks/line-status-parsed.mock';
import lineStatusMappedMock from './mocks/line-status-mapped.mock';

describe('tfl-line-status', function () {
  const tflLineStatus = new TflLineStatus();

  it('should be a valid Object', function () {
    expect(tflLineStatus).to.be.an('object');
  });

  describe('_getStatus', function () {
    it('should be defined', function () {
      expect(tflLineStatus._getStatus).to.be.a('function');
    });

    it('should return an error from async.waterfall', sinon.test(function (done) {
      const success = this.spy();
      const fakeError = new Error('fake error');

      const waterfall = this.stub(async, 'waterfall', (list, callback) => {
        callback(fakeError);
      });

      tflLineStatus._getStatus().then(success, (err) => {
        try {
          sinon.assert.calledOnce(waterfall);
          sinon.assert.notCalled(success);
          expect(err).to.eql(fakeError);
        } catch (e) {
          done(e);
          return;
        }

        done();
      });
    }));

    it('should trigger async.waterfall', sinon.test(function () {
      const waterfall = this.spy(async, 'waterfall');

      tflLineStatus._getStatus();

      sinon.assert.calledOnce(waterfall);
    }));

    it('should trigger the callback', sinon.test(function (done) {
      const fail = this.spy();

      const loadLineStatusXML = this.stub(util, 'loadLineStatusXML', (callback) => {
        callback(null, lineStatusParsedMock);
      });

      tflLineStatus._getStatus().then((res) => {
        try {
          sinon.assert.calledOnce(loadLineStatusXML);
          sinon.assert.notCalled(fail);
          expect(res).to.eql(res);
        } catch (e) {
          done(e);
          return;
        }

        done();
      }, fail);
    }));
  });

  describe('getStatus', function () {

    beforeEach(function () {
      tflLineStatus.getStatus.clear();
    });

    it('should be defined', function () {
      expect(tflLineStatus.getStatus).to.be.a('function');
    });

    it('should trigger async.waterfall', sinon.test(function () {
      const waterfall = this.spy(async, 'waterfall');

      tflLineStatus.getStatus();

      sinon.assert.calledOnce(waterfall);
    }));

    it('should leverage the memoize cache', sinon.test(function (done) {
      const waterfall = this.spy(async, 'waterfall');
      const fail = this.spy();
      const fail2 = this.spy();

      const loadLineStatusXML = this.stub(util, 'loadLineStatusXML', (callback) => {
        callback(null, lineStatusParsedMock);
      });

      tflLineStatus.getStatus().then(res => {
        try {
          sinon.assert.calledOnce(waterfall);
          sinon.assert.calledOnce(loadLineStatusXML);
          sinon.assert.notCalled(fail);
          expect(res).to.eql(lineStatusMappedMock);
        } catch (e) {
          done(e);
          return;
        }

        tflLineStatus.getStatus().then(res2 => {
          try {
            sinon.assert.calledOnce(waterfall);
            sinon.assert.calledOnce(loadLineStatusXML);
            sinon.assert.notCalled(fail2);
            expect(res2).to.eql(lineStatusMappedMock);
          } catch (e) {
            done(e);
            return;
          }

          done();
        }, fail2);
      }, fail);
    }));
  });

  describe('getStatusByKey', function () {

    before(function () {
      sinon.config = {
        useFakeTimers: false
      };
    });

    beforeEach(function () {
      tflLineStatus.getStatus.clear();
    });

    it('should be defined', function () {
      expect(tflLineStatus.getStatusByKey).to.be.a('function');
    });

    it('should return the error: key is not a valid String', sinon.test(function (done) {
      const success = this.spy();
      const getStatus = this.spy(tflLineStatus, 'getStatus');

      tflLineStatus.getStatusByKey(null).then(success, (err) => {
        try {
          sinon.assert.notCalled(getStatus);
          sinon.assert.notCalled(success);
          expect(err).to.be.an('error');
          expect(err.message).to.equal('key is not a valid String');
        } catch (e) {
          done(e);
          return;
        }

        done();
      });
    }));

    it('should return the error: list is not a valid Array, String or Number', sinon.test(function (done) {
      const success = this.spy();
      const getStatus = this.spy(tflLineStatus, 'getStatus');

      tflLineStatus.getStatusByKey('id').then(success, (err) => {
        try {
          sinon.assert.notCalled(getStatus);
          sinon.assert.notCalled(success);
          expect(err).to.be.an('error');
          expect(err.message).to.equal('list is not a valid Array, String or Number');
        } catch (e) {
          done(e);
          return;
        }

        done();
      });
    }));

    it('should return an error raised by getStatus', sinon.test(function (done) {
      const success = this.spy();
      const fakeError = new Error('fake error');

      const getStatus = this.stub(tflLineStatus, 'getStatus', () => {
        const deferred = Q.defer();

        setTimeout(function () {
          deferred.reject(fakeError);
        }, 10);

        return deferred.promise;
      });

      tflLineStatus.getStatusByKey('id', ['1']).then(success, (err) => {

        try {
          sinon.assert.notCalled(success);
          expect(err).to.eql(fakeError);
        } catch (e) {
          done(e);
          return;
        }

        getStatus.restore();

        done();
      });
    }));

    it('should get the correct status, given id = "1"', sinon.test(function (done) {
      const fail = this.spy();

      const expected = [lineStatusMappedMock[0]];

      const getStatus = this.stub(tflLineStatus, 'getStatus', (callback) => {
        const deferred = Q.defer();

        setTimeout(function () {
          deferred.resolve(lineStatusMappedMock);
        }, 10);

        return deferred.promise;
      });

      tflLineStatus.getStatusByKey('id', '1').then((res) => {

        try {
          sinon.assert.notCalled(fail);
          expect(res).to.eql(expected);
        } catch (e) {
          done(e);
          return;
        }

        getStatus.restore();

        done();
      }, fail);
    }));

    it('should get the correct status, given id = ["1"]', sinon.test(function (done) {
      const fail = this.spy();

      const expected = [lineStatusMappedMock[0]];

      const getStatus = this.stub(tflLineStatus, 'getStatus', (callback) => {
        const deferred = Q.defer();

        setTimeout(function () {
          deferred.resolve(lineStatusMappedMock);
        }, 10);

        return deferred.promise;
      });

      tflLineStatus.getStatusByKey('id', ['1']).then((res) => {

        try {
          sinon.assert.notCalled(fail);
          expect(res).to.eql(expected);
        } catch (e) {
          done(e);
          return;
        }

        getStatus.restore();

        done();
      }, fail);
    }));
  });
});
