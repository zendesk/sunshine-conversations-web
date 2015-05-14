'use strict';

var Backbone = require('backbone');

var utils = require('../utils');

module.exports = Backbone.Collection.extend({
    sync: utils.sync
});