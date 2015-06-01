'use strict';

var BaseServerMock = require('./baseServerMock');

var userStore = require('../data/users');

module.exports = BaseServerMock.extend({
    routes: function() {
        var faye = require('faye');
        var endpoint = require('../../src/js/endpoint');

        var routes = [
            ['POST', /\/api\/appboot/, [200, {
                    'Content-Type': 'application/json'
                    }, JSON.stringify({
                        appUserId: 1
                    })
            ]],
            ['PUT', /\/api\/appusers\/(\d+)/, ''],
            ['OPTIONS', /\/api\/appusers\/(\d+)/, [200, {
                'Access-Control-Allow-Origin': '*',
                'Vary': 'Origin',
                'Access-Control-Allow-Methods': ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
                'Access-Control-Allow-Headers': ['accept', 'app-token', 'content-type'],
                'Content-Length': 0,
                'Connection': 'keep-alive'
            }, '']]
        ];

        return routes;
    }
});
