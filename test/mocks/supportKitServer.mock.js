'use strict';

var _ = require('underscore');
var BaseServerMock = require('./baseServerMock');

var userStore = require('../data/users'),
    conversationStore = require('../data/conversations');

module.exports = BaseServerMock.extend({
    routes: function() {
        var faye = require('faye');
        var endpoint = require('../../src/js/endpoint');

        var routes = [
            [
                'OPTIONS', /.*/, [200, {
                    'Access-Control-Allow-Origin': '*',
                    'Vary': 'Origin',
                    'Access-Control-Allow-Methods': ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
                    'Access-Control-Allow-Headers': ['accept', 'app-token', 'content-type'],
                    'Connection': 'keep-alive'
                }, '']
            ],
            [
                'GET', /\/faye.*/, [200, {}, '']
            ],
            [
                'POST', /\/api\/appboot/, [200, {
                    'Content-Type': 'application/json'
                }, JSON.stringify({
                    appUserId: 1
                })]
            ],
            [
                'PUT', /\/api\/appusers\/(\d+)/, function(xhr, id) {
                    xhr.respond(200, {}, JSON.stringify(userStore[id]))
                }
            ],
            [
                'GET', /\/api\/conversations/, [200, {
                    'Content-Type': 'application/json'
                }, JSON.stringify(_(conversationStore).values())]
            ],
        ];

        return routes;
    }
});
