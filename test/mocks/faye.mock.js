'use strict';

var BaseMock = require('./baseMock');
var faye = require('faye');

module.exports = BaseMock.extend({
    target: faye.Client.prototype,
    methods: {
        addExtension: function(extension){},

        subscribe: function(channelName, callback) {
            this.__channels  || (this.__channels = {});
            this.__channels[channelName] = callback;
        }
    }
});
