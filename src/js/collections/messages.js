'use strict';
var Backbone = require('backbone');
var Message = require('../models/message');

module.exports = Backbone.Collection.extend({
    model: Message,
    comparator: 'received'
});
