import _ from 'lodash';
import async from 'async';
import memoize from 'memoizee';
import Q from 'q';

import util from './util/main';

/**
 * [TflLineStatus description]
 */
export default class {
  constructor() {
    this.getStatus = memoize(this._getStatus.bind(this), {
      maxAge: 30000,
      preFetch: 0.1,
      primitive: true,
      promise: 'then'
    });
  }

  _getStatus() {
    const deferred = Q.defer();

    async.waterfall([
      util.loadLineStatusXML,
      util.mapLineStatus
    ], (err, res) => {
      if (err) {
        deferred.reject(err);
        return;
      }

      deferred.resolve(res);
    });

    return deferred.promise;
  }

  getStatusByKey(key = 'id', values = []) {
    const deferred = Q.defer();

    let err = null;

    let _values = [];

    if (_.isNumber(values) || _.isString(values)) {
      _values.push(values);
    } else if (_.isArray(values)) {
      _values = values;
    }

    if (!_.isString(key)) {
      err = new Error('key is not a valid String');
    } else if (_.size(_values) <= 0) {
      err = new Error('list is not a valid Array, String or Number');
    }

    if (err) {
      setTimeout(() => {
        deferred.reject(err);
      }, 10);
    } else {
      this.getStatus().then(res => {
        deferred.resolve(_.filter(res, ls => {
          return _.indexOf(_values, ls[key]) >= 0;
        }));
      }, deferred.reject);
    }

    return deferred.promise;
  }
}
