'use strict';

var BaseMock = require('./baseMock');
var faye = require('faye'),
    $ = require('jquery');

module.exports = BaseMock.extend({
    target: faye.Client.prototype,
    methods: {
        addExtension: function(extension){},

        subscribe: function(channelName, callback) {
            var deferred = $.Deferred();
            this.__channels  || (this.__channels = {});
            this.__channels[channelName] = callback;

            deferred.resolve();

            return deferred;
        }
    }
});
