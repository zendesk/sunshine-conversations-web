'use strict';

exports.__esModule = true;
var configureStore = (process.env.NODE_ENV === 'development' ? require('./configure-dev') : require('./configure-prod')).configureStore;

var store = exports.store = configureStore({});