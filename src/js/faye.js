'use strict';

var Faye = require('faye');
var endpoint = require('./endpoint');
var vent = require('./vent');

module.exports.init = function(conversationId) {
    var faye = new Faye.Client(endpoint.rootUrl + '/faye');
    faye.addExtension({
        outgoing: function(message, callback) {
            if (message.channel === '/meta/subscribe') {
                message.appToken = endpoint.appToken;
                message.appUserId = endpoint.appUserId;
            }

            callback(message);
        }
    });

    faye.subscribe('/conversations/' + conversationId, function(message) {
        vent.trigger('message', message);
    }).then(null, function(err) {
        console.error('Faye subscription error:', err && err.message);
    });
};