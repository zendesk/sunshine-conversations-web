'use strict';

var Faye = require('faye');
var _ = require('underscore');
var endpoint = require('./endpoint');
var vent = require('./vent');

module.exports.init = function(conversationId) {
    var faye = new Faye.Client(endpoint.rootUrl + '/faye');
    faye.addExtension({
        outgoing: function(message, callback) {
            if (message.channel === '/meta/subscribe') {
                if (endpoint.jwt) {
                    message.jwt = endpoint.jwt;
                } else {
                    message.appUserId = endpoint.appUserId;
                }

                message.appToken = endpoint.appToken;
            }

            callback(message);
        }
    });

    var subscription = faye.subscribe('/conversations/' + conversationId, function(message) {
        vent.trigger('receive:message', message);
    });


    return subscription.then(_.constant({
        subscription: subscription
    }));
};
