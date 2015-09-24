'use strict';

var Backbone = require('backbone');
var Conversation = require('../models/conversation');

module.exports = Backbone.Collection.extend({
    model: Conversation,
    url: 'conversations/'
});
