'use strict';

var Backbone = require('backbone');

var mixins = require('../mixins');

module.exports = Backbone.Collection.extend({
    sync: mixins.sync
});
