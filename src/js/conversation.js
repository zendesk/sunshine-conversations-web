var _ = require('underscore');
var Backbone = require('backbone');
var baseMethods = require('./baseMethods');
var endpoint = require('./endpoint');

var Conversation = Backbone.Model.extend({
    url: function() {
        return endpoint.rootUrl + '/api/conversations/' + this.get('id') + '/messages';
    }
});

_.extend(Conversation.prototype, baseMethods);
module.exports = Conversation;