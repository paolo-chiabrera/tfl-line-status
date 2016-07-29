import {expect} from 'chai';
import sinon from 'sinon';

import TflLineStatus from '../lib/index';
import main from '../lib/modules/main';

import lineStatusParsedMock from './mocks/line-status-parsed.mock';
import lineStatusMappedMock from './mocks/line-status-mapped.mock';

describe('tfl-line-status', function () {
  const tflLineStatus = new TflLineStatus();

  it('should be a valid Object', function () {
    expect(tflLineStatus).to.be.an('object');
  });

  describe('getLines', function () {
    it('should be defined', function () {
      expect(tflLineStatus.getLines).to.be.a('function');
    });

    it('should return the lines', function () {
      expect(tflLineStatus.getLines()).to.eql(Object.keys(main.mapCode.codeToId));
    });
  });

  describe('setLines', function () {
    it('should be defined', function () {
      expect(tflLineStatus.setLines).to.be.a('function');
    });

    it('should not set the lines', function () {
      const tflLineStatus = new TflLineStatus();
      const newLines = [];

      tflLineStatus.setLines(newLines);

      expect(tflLineStatus.getLines()).to.not.eql(newLines);
    });

    it('should set the lines', function () {
      const tflLineStatus = new TflLineStatus();
      const newLines = ['X', 'Y', 'Z'];

      tflLineStatus.setLines(newLines);

      expect(tflLineStatus.getLines()).to.eql(newLines);
    });
  });

  describe('_getAllStatuses', function () {
    it('should be defined', function () {
      expect(tflLineStatus._getAllStatuses).to.be.a('function');
    });

    it('should return an error from loadLineStatusXML', sinon.test(function (done) {
      const success = this.spy();
      const fakeError = new Error('fake error');

      const loadLineStatusXML = this.stub(main, 'loadLineStatusXML', (callback) => {
        callback(fakeError);
      });

      tflLineStatus._getAllStatuses().then(success, (err) => {
        try {
          sinon.assert.notCalled(success);
          expect(err).to.eql(fakeError);
        } catch (e) {
          done(e);
          return;
        }

        loadLineStatusXML.restore();

        done();
      });
    }));

    it('should return an error from mapLineStatus', sinon.test(function () {
      const success = this.spy();
      const fakeError = new Error('fake error');

      const loadLineStatusXML = this.stub(main, 'loadLineStatusXML', (callback) => {
        callback(null, lineStatusParsedMock);
      });

      const mapLineStatus = this.stub(main, 'mapLineStatus', (callback) => {
        throw fakeError;
      });

      tflLineStatus._getAllStatuses().then(success, (err) => {
        try {
          sinon.assert.notCalled(success);
          sinon.assert.calledOnce(loadLineStatusXML);
          expect(err).to.eql(fakeError);
        } catch (e) {
          done(e);
          return;
        }

        loadLineStatusXML.restore();
        mapLineStatus.restore();

        done();
      });
    }));

    it('should work correctly', sinon.test(function () {
      const fail = this.spy();
      const fakeError = new Error('fake error');

      const loadLineStatusXML = this.stub(main, 'loadLineStatusXML', (callback) => {
        callback(null, lineStatusParsedMock);
      });

      const mapLineStatus = this.spy(main, 'mapLineStatus');

      tflLineStatus._getAllStatuses().then(res => {
        try {
          sinon.assert.notCalled(fail);
          sinon.assert.calledOnce(loadLineStatusXML);
          sinon.assert.calledOnce(mapLineStatus);
          expect(res).to.eql(lineStatusMappedMock);
        } catch (e) {
          done(e);
          return;
        }

        loadLineStatusXML.restore();
        mapLineStatus.restore();

        done();
      }, fail);
    }));
  });

  describe('getAllStatuses', function () {
    it('should be defined', function () {
      expect(tflLineStatus.getAllStatuses).to.be.a('function');
    });

    it('should leverage the memoize cache', sinon.test(function (done) {
      const fail = this.spy();
      const fail2 = this.spy();

      const loadLineStatusXML = this.stub(main, 'loadLineStatusXML', (callback) => {
        callback(null, lineStatusParsedMock);
      });

      tflLineStatus.getAllStatuses().then(res => {
        try {
          sinon.assert.calledOnce(loadLineStatusXML);
          sinon.assert.notCalled(fail);
          expect(res).to.eql(lineStatusMappedMock);
        } catch (e) {
          done(e);
          return;
        }

        tflLineStatus.getAllStatuses().then(res2 => {
          try {
            sinon.assert.calledOnce(loadLineStatusXML);
            sinon.assert.notCalled(fail2);
            expect(res2).to.eql(lineStatusMappedMock);
          } catch (e) {
            done(e);
            return;
          }

          loadLineStatusXML.restore();

          done();
        }, fail2);
      }, fail);
    }));
  });

  describe('getLineStatusByCode', function () {
    it('should be defined', function () {
      expect(tflLineStatus.getLineStatusByCode).to.be.a('function');
    });

    it('should return only the line status filtered by code', sinon.test(function (done) {
      const fail = this.spy();

      const loadLineStatusXML = this.stub(main, 'loadLineStatusXML', (callback) => {
        callback(null, lineStatusParsedMock);
      });

      const expected = lineStatusMappedMock[0];

      tflLineStatus.getAllStatuses.clear();

      tflLineStatus.getLineStatusByCode(expected.code).then(res => {
        try {
          sinon.assert.calledOnce(loadLineStatusXML);
          sinon.assert.notCalled(fail);
          expect(res).to.eql(expected);
        } catch (e) {
          done(e);
          return;
        }

        loadLineStatusXML.restore();

        done();
      }, fail);
    }));
  });

  describe('getLineStatus', function () {
    let loadLineStatusXML = null;

    beforeEach(function () {
      loadLineStatusXML = sinon.stub(main, 'loadLineStatusXML', (callback) => {
        callback(null, lineStatusParsedMock);
      });
    });

    afterEach(function () {
      loadLineStatusXML.restore();
    });

    it('should be defined', function () {
      expect(tflLineStatus.getLineStatus).to.be.a('function');
    });

    it('should wire getAllStatuses', sinon.test(function (done) {
      const fail = this.spy();

      tflLineStatus.getAllStatuses.clear();

      const getAllStatuses = this.spy(tflLineStatus, 'getAllStatuses');

      tflLineStatus.getLineStatus().then(res => {
        try {
          sinon.assert.calledOnce(getAllStatuses);
          sinon.assert.calledOnce(loadLineStatusXML);
          sinon.assert.notCalled(fail);
          expect(res).to.eql(lineStatusMappedMock);
        } catch (e) {
          done(e);
          return;
        }

        getAllStatuses.restore();

        done();
      }, fail);
    }));

    it('should wire getLineStatusByCode', sinon.test(function (done) {
      const fail = this.spy();

      tflLineStatus.getAllStatuses.clear();

      const getLineStatusByCode = this.spy(tflLineStatus, 'getLineStatusByCode');

      const expected = lineStatusMappedMock[0];

      tflLineStatus.getLineStatus(expected.code).then(res => {
        try {
          sinon.assert.calledOnce(getLineStatusByCode);
          sinon.assert.calledOnce(loadLineStatusXML);
          sinon.assert.notCalled(fail);
          expect(res).to.eql(expected);
        } catch (e) {
          done(e);
          return;
        }

        getLineStatusByCode.restore();

        done();
      }, fail);
    }));
  });
});
