'use strict';

var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    BaseModel = require('./baseModel');

var AppUser = module.exports = BaseModel.extend({
    initialize: function() {
        this._lastPropertyValues = {};

        this.on('sync', function() {
            this._lastPropertyValues = this.pick(AppUser.EDITABLE_PROPERTIES);
        }.bind(this));
    },

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
    },

    isDirty: function() {
        var hasChanged = false;

        _.each(AppUser.EDITABLE_PROPERTIES, function(property) {
            hasChanged = hasChanged || this._lastPropertyValues[property] !== this.get(property);
        }.bind(this));

        return hasChanged;
    },

    save: function() {
        if (this.isDirty()) {
            return Backbone.Model.prototype.save.apply(this, _.toArray(arguments));
        } else {
            return $.Deferred().resolve(this, null, null).promise();
        }
    }
}, {
    EDITABLE_PROPERTIES: ['givenName',
        'surname',
        'email',
        'properties']
});
