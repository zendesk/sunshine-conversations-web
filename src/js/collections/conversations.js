var endpoint = require('../endpoint'),
    urljoin = require('url-join');

var BaseCollection = require('./baseCollection');
var Conversation = require('../models/conversation');

module.exports = BaseCollection.extend({
    model: Conversation,
    url: urljoin(endpoint.rootUrl, 'api/conversations/')
});
