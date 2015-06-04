'use strict';

var Backbone = require('backbone-associations');

var mixins = require('../mixins');

module.exports = Backbone.AssociatedModel.extend({
    sync: mixins.sync
});
