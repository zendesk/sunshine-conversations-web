'use strict';
var Backbone = require('backbone');
var api = require('./api');


Backbone.ajax = function(options) {

    // convert to our client interface
    options.method = options.type;
    delete options.type;

    return api.call(options);
};
