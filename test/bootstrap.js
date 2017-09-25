'use strict';
const {setUp} = require('../src/frame/js/utils/polyfills');
setUp();
const sinon = require('sinon');
sinon.behavior = require('sinon/lib/sinon/behavior');
sinon.defaultConfig = {
    injectInto: null,
    properties: ['spy', 'stub', 'mock', 'clock', 'server', 'requests'],
    useFakeTimers: true,
    useFakeServer: true
};
require('./utils/sinon');
