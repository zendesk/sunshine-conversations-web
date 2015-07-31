'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var BaseModel = require('./baseModel');

var Event = require('./event');

module.exports = BaseModel.extend({
    idAttribute: '_id',

    parse: function(data) {
        return _(data).extend({
            events: _(data.events || []).map(function(event) {
                return {
                    name: event
                };
            })
        });
    },

    relations: [{
        type: Backbone.Many,
        key: 'events',
        relatedModel: Event
    }]
});
