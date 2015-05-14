'use strict';


var endpoint = require('../endpoint');

var BaseCollection  = require('./base-collection');
var Conversation = require('../models/conversation');

module.exports = BaseCollection.extend({
    model: Conversation,
    url: endpoint.rootUrl + '/api/conversations/'
});
