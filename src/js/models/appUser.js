'use strict';

var Backbone = require('backbone'),
    _ = require('underscore'),
    BaseModel = require('./baseModel');

module.exports = BaseModel.extend({
    parse: function(data) {
        return _.isObject(data) ? data : {
            id: data
        };
    },
    url: function() {
        return 'appusers/' + this.id;
    }
});
