'use strict';

var _ = require('underscore');
var BaseServerMock = require('./baseServerMock');

var conversationStore = require('../data/conversations');
var appData = require('../data/app');

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
            'POST', /\/api\/appboot/, [201, {
                'Content-Type': 'application/json'
            }, JSON.stringify(appData)]
        ],
        [
            'POST', /\/api\/appusers\/([a-z0-9]+)\/event/, function(xhr) {
                xhr.respond(201, {
                    'Content-Type': 'application/json'
                }, _.isString(xhr.requestBody) ? xhr.requestBody : JSON.stringify(xhr.requestBody));
            }
        ],
        [
            'PUT', /\/api\/appusers\/([a-z0-9]+)/, function(xhr/*, id*/) {
                xhr.respond(200, {
                    'Content-Type': 'application/json'
                }, _.isString(xhr.requestBody) ? xhr.requestBody : JSON.stringify(xhr.requestBody));
            }
        ],
        [
            'GET', /\/api\/conversations/, [200, {
                'Content-Type': 'application/json'
            }, JSON.stringify(_(conversationStore).values())]
        ],
        [
            'POST', /\/api\/conversations/, [200, {
                'Content-Type': 'application/json'
            }, JSON.stringify({_id: '123123'})]
        ],
        [
            'POST', /\/api\/conversations\/([a-z0-9]+)\/messages/, function(xhr) {
                xhr.respond(201, {
                    'Content-Type': 'application/json'
                }, _.isString(xhr.requestBody) ? xhr.requestBody : JSON.stringify(xhr.requestBody));
            }
        ],
        [
            'PUT', /\/api\/event/, function(xhr) {
                xhr.respond(200, {
                    'Content-Type': 'application/json'
                }, JSON.stringify({}));
            }
        ],
    ]
});
