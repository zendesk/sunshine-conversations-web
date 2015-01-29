var _ = require('underscore');
var Backbone = require('backbone');
var baseMethods = require('./baseMethods');
var Conversation = require('./conversation');
var endpoint = require('./endpoint');

var ConversationCollection = Backbone.Collection.extend({
    model: Conversation,
    url: function() {
        return endpoint.rootUrl + '/api/conversations?appUserId=' + endpoint.appUserId;
    }
});

_.extend(ConversationCollection.prototype, baseMethods);
module.exports = ConversationCollection;