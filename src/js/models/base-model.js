'use strict';

var Backbone = require('backbone');

var utils = require('../utils');

module.exports = Backbone.RelationalModel.extend({
    sync: utils.sync
});