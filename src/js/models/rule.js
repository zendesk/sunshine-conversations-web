'use strict';

var _ = require('underscore');
var Backbone = require('backbone-associations');

/*jshint -W079 */
var Event = require('./event');
/*jshint +W079 */

module.exports = Backbone.AssociatedModel.extend({
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
