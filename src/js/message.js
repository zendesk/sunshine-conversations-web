var _ = require('underscore');
var Backbone = require('backbone');
var baseMethods = require('./baseMethods');
var endpoint = require('./endpoint');

var Message = Backbone.Model.extend({
    url: function() {
        return endpoint.rootUrl + '/api/conversations/' + this.conversationId + '/messages';
    }
});

_.extend(Message.prototype, baseMethods);
module.exports = Message;