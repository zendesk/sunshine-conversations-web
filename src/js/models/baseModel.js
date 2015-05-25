'use strict';

var Backbone = require('backbone');

var utils = require('../utils');

module.exports = Backbone.AssociatedModel.extend({
    sync: utils.sync
});