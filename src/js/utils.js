'use strict';

var Backbone = require('backbone'),
    _ = require('underscore'),
    $ = require('jquery');

var endpoint = require('./endpoint');

module.exports = {
    sync: function(method, model, options) {
        options.beforeSend = function(xhr) {
            xhr.setRequestHeader('app-token', endpoint.appToken);
            xhr.setRequestHeader('Content-Type', 'application/json');
        };

        _.extend(options, {
            data: $.param({
                appUserId: endpoint.appUserId
            })
        });

        return Backbone.sync.call(this, method, model, options);
    }
}