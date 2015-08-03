'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var BaseModel = require('./baseModel');

var AppUser = require('./appUser');

module.exports = BaseModel.extend({
    parse: function(data) {
        return _.isObject(data) ? data : {
            name: data
        };
    },

    relations: [
        {
            type: Backbone.One,
            key: 'user',
            relatedModel: AppUser
        }
    ]
});
