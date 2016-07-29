import _ from 'lodash';

import mapCode from './mapCode';

/**
 * [parseLineStatus description]
 * @param  {Object}
 */
export default function mapLineStatus(feed) {
  if (!_.isObject(feed)) {
    throw new Error('feed is not an Object');
  }

  if (!_.isObject(feed.ArrayOfLineStatus)) {
    throw new Error('ArrayOfLineStatus is not an Object');
  }

  if (!_.isArray(feed.ArrayOfLineStatus.LineStatus)) {
    throw new Error('LineStatus is not an Array');
  }

  return _.map(feed.ArrayOfLineStatus.LineStatus, lineStatus => {
    return {
      id: lineStatus.Line.$.ID,
      code: mapCode.idToCode[lineStatus.Line.$.ID],
      name: lineStatus.Line.$.Name.toLowerCase(),
      status: lineStatus.Status.$.ID,
      desc: lineStatus.Status.$.Description,
      details: lineStatus.$.StatusDetails,
      active: lineStatus.Status.$.IsActive.toLowerCase() === 'true'
    };
  });
}
