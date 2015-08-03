'use strict';

var Backbone = require('backbone');
var _ = require('underscore');

var endpoint = require('./endpoint');

module.exports = {
    sync: function(method, model, options) {
        options.beforeSend = function(xhr) {
            xhr.setRequestHeader('app-token', endpoint.appToken);
            xhr.setRequestHeader('Content-Type', 'application/json');

            if (endpoint.jwt) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + endpoint.jwt);
            }

            this.url = endpoint.rootUrl + '/api/' + this.url;
        };
        // on a GET call, it goes in the request params,
        // on other call type (maybe not DELETE if ever supported),
        // it goes in the body
        if (method === 'read') {
            options.data = options.data || {};

            _.extend(options.data, {
                appUserId: endpoint.appUserId
            });
        } else {
            options.attrs = options.attrs || {};

            _.extend(options.attrs, model.toJSON(), {
                appUserId: endpoint.appUserId
            });
        }

        return Backbone.sync.call(this, method, model, options);
    }
};
