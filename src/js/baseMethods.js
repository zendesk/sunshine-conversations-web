var Backbone = require('backbone');
var sync = Backbone.sync;

module.exports = {
    initialize: function(options) {
        this.baseUrl = options.baseUrl;
        this.appToken = options.appToken;
        this.appUserId = options.appUserId;
    },

    sync: function(method, model, options) {
        var self = this;
        options.beforeSend = function(xhr) {
            xhr.setRequestHeader('app-token', self.appToken);
            xhr.setRequestHeader('Content-Type', 'application/json');
        };
        return sync(method, model, options);
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
};