'use strict';

var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    BaseModel = require('./baseModel');

var AppUser = module.exports = BaseModel.extend({
    parse: function(data) {
        return _.isObject(data) ? data : {
            id: data
        };
    },

    url: function() {
        return 'appusers/' + this.id;
    },

    defaults: function() {
        return {
            properties: {},
            conversationStarted: false
        };
    }
}, {
    EDITABLE_PROPERTIES: ['givenName',
        'surname',
        'email',
        'properties']
});
