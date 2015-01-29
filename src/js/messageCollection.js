var _ = require('underscore');
var Backbone = require('backbone');
var baseMethods = require('./baseMethods');
var Message = require('./message');
var endpoint = require('./endpoint');

var MessageCollection = Backbone.Collection.extend({
    model: Message,
    url: function() {
        return endpoint.rootUrl + '/api/conversations/' + this.conversationId + '/messages';
    },

    fetchPromise: function() {
        var deferred = $.Deferred();

        this.fetch({
            success: function(result) {
                deferred.resolve(result);
            },
            error: function(err) {
                deferred.reject(err);
            }
        });

        return deferred;
    }
});

_.extend(MessageCollection.prototype, baseMethods);
module.exports = MessageCollection;