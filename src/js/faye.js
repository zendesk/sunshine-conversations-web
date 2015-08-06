'use strict';

var Faye = require('faye');
var endpoint = require('./endpoint');
var vent = require('./vent');
var $ = require('jquery');

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

    // this is needed since Faye is using a Promise implementation
    // that only has `then(resolve, reject)` and `all` methods.
    var deferred = $.Deferred();

    faye.subscribe('/conversations/' + conversationId, function(message) {
        vent.trigger('receive:message', message);
    }).then(function() {
        deferred.resolve(faye);
    }, function(err) {
        console.error('Faye subscription error:', err && err.message);
        deferred.reject(err);
    });

    return deferred;
};
