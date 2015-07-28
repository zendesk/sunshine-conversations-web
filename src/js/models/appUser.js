'use strict';

var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    BaseModel = require('./baseModel');

var AppUser = module.exports = BaseModel.extend({
    initialize: function() {
        this._lastPropertyValues = this.pick(AppUser.EDITABLE_PROPERTIES);
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
        return _.some(AppUser.EDITABLE_PROPERTIES, function(property) {
            return this._lastPropertyValues[property] !== this.get(property);
        }.bind(this));
    },

    save: function() {
        if (this.isDirty()) {
            this._lastPropertyValues = this.pick(AppUser.EDITABLE_PROPERTIES);
            return Backbone.Model.prototype.save.apply(this, _.toArray(arguments));
        } else {
            return $.Deferred().resolve(this, null, null);
        }
    }
}, {
    EDITABLE_PROPERTIES: [
        'givenName',
        'surname',
        'email',
        'properties'
    ]
});
