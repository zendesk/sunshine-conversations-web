'use strict';

var _ = require('underscore');
var BaseServerMock = require('./baseServerMock');

var conversationData = require('../data/conversation');
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
            'POST', /\/v1\/init/, function(xhr) {
                var body = JSON.parse(xhr.requestBody);

                var data = _.extend({
                    appUserId: _.uniqueId()
                }, appData);

                _.extend(data.appUser, {
                    _id: data.appUserId
                });

                if (body.userId) {
                    _.extend(data.appUser, {
                        userId: body.userId
                    });
                }

                xhr.respond(201, {
                    'Content-Type': 'application/json'
                }, JSON.stringify(data));
            }
        ],
        [
            'POST', /\/v1\/appusers\/([a-z0-9_\-%]+)\/events/, function(xhr) {
                xhr.respond(200, {
                    'Content-Type': 'application/json'
                }, JSON.stringify({
                    conversationUpdated: false
                }));
            }
        ],
        [
            'PUT', /\/v1\/appusers\/([a-z0-9_\-%]+)/, function(xhr /*, id*/ ) {
                var requestBody = _.isString(xhr.requestBody) ? JSON.parse(xhr.requestBody) : xhr.requestBody;
                var body = {
                    appUser: requestBody
                };

                xhr.respond(200, {
                    'Content-Type': 'application/json'
                }, JSON.stringify(body));
            }
        ],
        [
            'GET', /\/v1\/appusers\/([a-z0-9_\-%]+)\/conversation/, function(xhr /*, id*/ ) {
                xhr.respond(200, {
                    'Content-Type': 'application/json'
                }, JSON.stringify(conversationData));
            }
        ],
        [
            'POST', /\/v1\/appusers\/([a-z0-9_\-%]+)\/conversation\/messages/, function(xhr) {
                var message = _.isString(xhr.requestBody) ? JSON.parse(xhr.requestBody) : xhr.requestBody;
                message._id = _.uniqueId();
                var conversation = _.extend({}, conversationData, {
                    messages: [
                        message
                    ]
                });

                var body = {
                    conversation: conversation,
                    message: message
                };

                xhr.respond(200, {
                    'Content-Type': 'application/json'
                }, JSON.stringify(body));
            }
        ]
    ]
});
