'use strict';

var _ = require('underscore');
var BaseServerMock = require('./baseServerMock');

var userStore = require('../data/users'),
    conversationStore = require('../data/conversations');

module.exports = BaseServerMock.extend({
    routes: [
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
            'PUT', /\/api\/appusers\/([a-z0-9]+)/, function(xhr, id) {
                xhr.respond(200, {}, JSON.stringify(userStore[id]))
            }
        ],
        [
            'GET', /\/api\/conversations/, [200, {
                'Content-Type': 'application/json'
            }, JSON.stringify(_(conversationStore).values())]
        ],
        [
            'POST', /\/api\/conversations\/([a-z0-9]+)\/messages/, function(xhr, id) {
                xhr.respond(200, {}, JSON.stringify(xhr.requestBody))
            }
        ],
    ]
});
