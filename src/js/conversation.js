var _ = require('underscore');
var Backbone = require('backbone');
var sync = Backbone.sync;
var baseMethods = require('./baseMethods');

var Conversation = Backbone.Model.extend({
    url: function() {
        return this.baseUrl + '/api/conversations/' + this.get('id') + '/messages';
    }
});

_.extend(Conversation.prototype, baseMethods);
module.exports = Conversation;