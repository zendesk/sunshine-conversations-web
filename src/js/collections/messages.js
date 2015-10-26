'use strict';
var Backbone = require('backbone');
var Message = require('../models/message');
var _ = require('underscore');

module.exports = Backbone.Collection.extend({
    model: Message,
    comparator: 'received'
});
