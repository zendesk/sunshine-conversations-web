'use strict';
// require('babel-polyfill');
var sinon = require('sinon');
sinon.defaultConfig = {
    injectInto: null,
    properties: ['spy', 'stub', 'mock', 'clock', 'server', 'requests'],
    useFakeTimers: true,
    useFakeServer: true
};
