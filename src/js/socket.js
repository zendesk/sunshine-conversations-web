var io = require('socket.io-client');
var endpoint = require('./endpoint');
var vent = require('./vent');

var host = endpoint.rootUrl.replace(/^http/, 'ws');

module.exports.listen = function(appUserId) {
    var socket = io.connect(host, {
        transports: ['websocket']
    });

    socket.on('connect', function() {
        socket.emit('authenticate', {
            appToken: endpoint.appToken,
            appUserId: endpoint.appUserId
        });

        socket.on('authenticate_failed', function() {
            console.error('supportkit authentication failed');
        });

        socket.on('message:' + endpoint.appUserId, function(message) {
            vent.trigger('message', message);
        });
    });
};