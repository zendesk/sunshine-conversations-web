var _ = require('underscore');
var Backbone = require('backbone');
var baseMethods = require('./baseMethods');
var endpoint = require('./endpoint');

var Conversation = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot: endpoint.rootUrl + '/api/conversations/',

    postMessage: function(message) {
        var path = '/api/conversations/' + this.id + '/messages';
        return endpoint.post(path, message.attributes);
    },

    fetchPromise: function() {
        var deferred = $.Deferred();

        this.fetch({
            success: function(result) {
                deferred.resolve(result);
            },
            error: function(err) {
                deferred.reject(err);
            },
            // fetch somehow calls add on existing message too. remove:false should help but doesn't
            remove: false
        });

        return deferred;
    }
});

_.extend(Conversation.prototype, baseMethods);
module.exports = Conversation;