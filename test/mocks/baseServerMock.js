'use strict';
var sinon = require('sinon'),
    _ = require('underscore');

var BaseMock = require('./baseMock');


module.exports = BaseMock.extend({
    // routes is an array of arguments to pass to `server.respondWith`
    // in sinon (http://sinonjs.org/docs/#server_example)
    //
    // It can be a function if it needs to rely on context to generate the
    // routes array.
    routes: [],

    mock: function() {
        this.server = this._sandbox.server;
        this.server.autoRespond = true;
        this.setUpRoutes();
    },

    setUpRoutes: function() {
        var routes = _.result(this, 'routes', []);

        _.each(routes, _(function(route) {
            this.server.respondWith.apply(this.server, route);
        }).bind(this));
    }
});
