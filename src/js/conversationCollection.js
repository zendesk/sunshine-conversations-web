var _ = require('underscore');
var Backbone = require('backbone');

var baseMethods = require('./baseMethods');
var Conversation = require('./conversation');

var ConversationCollection = Backbone.Collection.extend({
    model: Conversation,
    url: function() {
        return this.baseUrl + '/api/conversations?appUserId=' + this.appUserId;
    }
});

_.extend(ConversationCollection.prototype, baseMethods);
module.exports = ConversationCollection;