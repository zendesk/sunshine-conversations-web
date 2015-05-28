'use strict';

var BaseMock = require('./baseMock');
var faye = require('Faye');

module.exports = new BaseMock({
    target: faye.Client.prototype,
    methods: {
        addExtension: function(extension){},

        subscribe: function(channelName, callback) {
            this.__channels  || (this.__channels = {});
            this.__channels[channelName] = callback;
        }
    }
});
