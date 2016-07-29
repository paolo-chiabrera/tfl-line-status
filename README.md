# TFL Line Status [![Build Status](https://travis-ci.org/paolo-chiabrera/tfl-line-status.svg?branch=master)](https://travis-ci.org/paolo-chiabrera/tfl-line-status) [![Coverage Status](https://coveralls.io/repos/github/paolo-chiabrera/tfl-line-status/badge.svg?branch=master)](https://coveralls.io/github/paolo-chiabrera/tfl-line-status?branch=master)

[![NPM](https://nodei.co/npm/tfl-line-status.png)](https://nodei.co/npm/tfl-line-status/)

`tfl-line-status` provides a simple module to consume the TFL (Transport for London) Lines Status feed (XML) and convert/parse it in an easier form to handle with JS.

Maintained by [Paolo Chiabrera](https://github.com/paolo-chiabrera).

## Install

```
$ npm i tfl-line-status
```

## Usage

### ES6
```
import TflLineStatus from 'tfl-line-status';

const tflLineStatus = new TflLineStatus();
```

### ES5
```
var TflLineStatus = require('tfl-line-status');

var tflLineStatus = new TflLineStatus();
```

## API

### tflLineStatus.getLines()

it returns all the line codes (including also not tube lines, such as DLR)

```
const lines = tflLineStatus.getLines();

/* response sample */

['B', 'C', 'CI', 'D', 'H', 'J', 'M', 'N', 'P', 'V', 'W', 'DLR', 'OVG', 'RAIL', 'TRAMS']

```

### tflLineStatus.getLineStatus(code)

`code` (optional) accepted values are: ['B', 'C', 'CI', 'D', 'H', 'J', 'M', 'N', 'P', 'V', 'W', 'DLR', 'OVG', 'RAIL', 'TRAMS']

```
const promise = tflLineStatus.getLineStatus(code);

promise.then(function (response) {
    /* here you get the line status */
}, function (err) {
    /* too bad, something wrong happened */
});
```

if a valid code is passed, the promise will return the relative line status object

```
const promise = tflLineStatus.getLineStatus('B');

/* response sample */

{
  active: true,
  code: 'B',
  desc: 'Good Service',
  details: '',
  id: '1',
  name: 'bakerloo',
  status: 'GS'
}
```

if no code is provided, all line statuses will be retrieved and returned as an ordered array

```
const promise = tflLineStatus.getLineStatus('B');

/* response sample */

[{
  active: true,
  code: 'B',
  desc: 'Good Service',
  details: '',
  id: '1',
  name: 'bakerloo',
  status: 'GS'
}, {
  active: true,
  code: 'C',
  desc: 'Good Service',
  details: '',
  id: '2',
  name: 'central',
  status: 'GS'
}]
```

## Notes

The core method for getting the lines status feed is memoized in order to improve the performances,
the data is automatically refreshed ever 30 seconds.

## License

MIT
