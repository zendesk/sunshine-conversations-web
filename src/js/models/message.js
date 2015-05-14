var _ = require('underscore'),
    url = require('url');

var BaseModel = require('./base-model'),
    endpoint = require('../endpoint');

module.exports = BaseModel.extend({
    url: function() {
        return url.resolve(endpoint.rootUrl, '/api/conversations/', this.conversationId, '/messages');
    }
});