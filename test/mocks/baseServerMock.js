'use strict';
var _ = require('underscore');

var BaseMock = require('./baseMock');


var XHRMock = function(body) {
    this.requestBody = body;
};

XHRMock.prototype.respond = function(status, headers, body) {
    var mockResponse = new window.Response(body, {
        status: status,
        headers: headers
    });

    this.promise = Promise.resolve(mockResponse);
};


module.exports = BaseMock.extend({
    // routes is an array of arguments to pass to `server.respondWith`
    // in sinon (http://sinonjs.org/docs/#server_example)
    //
    // It can be a function if it needs to rely on context to generate the
    // routes array.
    routes: [],

    mock: function() {
        this._fetch = this._sandbox.stub(window, 'fetch', this._stubbedFetch.bind(this));
    },

    _findMatchingRoute: function(url, method) {
        var routes = _.result(this, 'routes', []);

        var matchingRoute;

        _.each(routes, function(route) {
            var routeMethod = route[0];
            var routeRegex = route[1];

            if (method === routeMethod && routeRegex.test(url)) {
                matchingRoute = route;
            }
        });

        return matchingRoute;
    },

    _stubbedFetch: function(url, options) {
        var route = this._findMatchingRoute(url, options.method);

        var response = route[2];

        var xhrMock = new XHRMock(options.body);

        if (_.isFunction(response)) {
            response(xhrMock);
        } else {
            xhrMock.respond(response[0], response[1], response[2]);
        }

        return xhrMock.promise;
    }
});