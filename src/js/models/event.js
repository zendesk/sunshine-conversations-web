'use strict';

var _ = require('underscore');
var Backbone = require('backbone-associations');

var AppUser = require('./appUser');

module.exports = Backbone.AssociatedModel.extend({
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
