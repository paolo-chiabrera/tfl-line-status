import _ from 'lodash';
import needle from 'needle';

/**
 * [loadLineStatusXML description]
 * @param  {Function}
 */
export default function loadLineStatusXML(callback) {
  if (!_.isFunction(callback)) {
    return;
  }

  const feedUrl = 'http://cloud.tfl.gov.uk/TrackerNet/LineStatus';

  const options = {
    headers: {
      'Content-Type': 'text/xml'
    }
  };

  needle.get(feedUrl, options, (err, res) => {
    if (err) {
      callback(err);
      return;
    }

    if (res.statusCode !== 200) {
      callback('wrong statusCode ' + res.statusCode);
      return;
    }

    callback(null, res.body);
  });
}
