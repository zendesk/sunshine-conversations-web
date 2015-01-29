var _ = require('underscore');
var Backbone = require('backbone');
var baseMethods = require('./baseMethods');
var Message = require('./message');

var MessageCollection = Backbone.Collection.extend({
    model: Message,
    url: function() {
        return this.baseUrl + '/api/conversations/' + this.conversationId + '/messages';
    }
});

_.extend(MessageCollection.prototype, baseMethods);
module.exports = MessageCollection;