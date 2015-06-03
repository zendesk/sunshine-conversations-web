'use strict';

var Backbone = require('backbone');

var mixins = require('../mixins');

module.exports = Backbone.AssociatedModel.extend({
    sync: mixins.sync
});
