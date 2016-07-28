# TFL Line Status [![Build Status](https://travis-ci.org/paolo-chiabrera/tfl-line-status.svg?branch=master)](https://travis-ci.org/paolo-chiabrera/tfl-line-status) [![Coverage Status](https://coveralls.io/repos/github/paolo-chiabrera/tfl-line-status/badge.svg?branch=master)](https://coveralls.io/github/paolo-chiabrera/tfl-line-status?branch=master)

[![NPM](https://nodei.co/npm/tfl-line-status.png)](https://nodei.co/npm/tfl-line-status/)

`tfl-line-status` provides a simple module to consume the TFL (Transport for London) Lines Status feed (XML) and convert/parse it in an easier form to handle with JS.

Maintained by [Paolo Chiabrera](https://github.com/paolo-chiabrera).

## Install

```
$ npm install tfl-line-status
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

### tflLineStatus.getStatus()
```
const promise = tflLineStatus.getStatus();

promise.then(function (response) {
    /* here you get the current status of all the lines */
}, function (err) {
    /* too bad, something wrong happened */
});
```

### tflLineStatus.getStatusByKey(key, values)

`key` must be a String
`values` can be either a String, a Number or an Array of String/Number

`response` will be always an Array containing at least 1 line status

```
const promise = tflLineStatus.getStatusByKey('name', 'central');

promise.then(response => {
    /* here you get ONLY the current status of CENTRAL line */
}, err => {
    /* too bad, something wrong happened */
});
```

```
const promise = tflLineStatus.getStatusByKey('name', ['central', 'victoria']);

promise.then(response => {
    /* here you get ONLY the current status of CENTRAL and VICTORIA lines */
}, err => {
    /* too bad, something wrong happened */
});
```

## Notes

The core method for getting the lines status feed is memoized in order to improve the performances,
the data is automatically refreshed ever 30 seconds.

## License

MIT
