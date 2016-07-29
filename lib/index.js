import _ from 'lodash';
import memoize from 'memoizee';
import Q from 'q';

import main from './modules/main';

/**
 * [TflLineStatus description]
 */
export default class {
  constructor() {
    this._lines = _.keys(main.mapCode.codeToId);

    this.getAllStatuses = memoize(this._getAllStatuses.bind(this), {
      length: 1,
      maxAge: 30000,
      preFetch: 0.1,
      primitive: true,
      promise: true
    });
  }

  getLines() {
    return this._lines;
  }

  setLines(lines) {
    if (_.isArray(lines) && !_.isEmpty(lines)) {
      this._lines = lines;
    }
  }

  getLineStatus(code = null) {
    if (_.isString(code) && !_.isEmpty(code)) {
      return this.getLineStatusByCode(code);
    }

    return this.getAllStatuses();
  }

  getLineStatusByCode(code) {
    return this.getAllStatuses().then((res) => {
      return _.find(res, {'code': code});
    });
  }

  _getAllStatuses() {
    const deferred = Q.defer();

    main.loadLineStatusXML((err, feed) => {
      if (err) {
        deferred.reject(err);
        return;
      }

      try {
        const result = main.mapLineStatus(feed);
        deferred.resolve(result);
      } catch (e) {
        deferred.reject(e);
      }
    });

    return deferred.promise;
  }
}
