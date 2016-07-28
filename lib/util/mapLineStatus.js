import _ from 'lodash';

/**
 * [parseLineStatus description]
 * @param  {Object}
 * @param  {Function}
 */
export default function mapLineStatus(feed, callback) {
  if (!_.isFunction(callback)) {
    return;
  }

  if (!_.isObject(feed)) {
    callback('feed is not an Object');
    return;
  }

  if (!_.isObject(feed.ArrayOfLineStatus)) {
    callback('ArrayOfLineStatus is not an Object');
    return;
  }

  if (!_.isArray(feed.ArrayOfLineStatus.LineStatus)) {
    callback('LineStatus is not an Array');
    return;
  }

  let lineStatus = null;

  try {
    lineStatus = _.map(feed.ArrayOfLineStatus.LineStatus, lineStatus => {
      return {
        id: lineStatus.Line.$.ID,
        name: lineStatus.Line.$.Name.toLowerCase(),
        status: lineStatus.Status.$.ID,
        desc: lineStatus.Status.$.Description,
        details: lineStatus.$.StatusDetails,
        active: lineStatus.Status.$.IsActive.toLowerCase() === 'true'
      };
    });
  } catch (e) {
    callback(e);
    return;
  }

  callback(null, lineStatus);
}
