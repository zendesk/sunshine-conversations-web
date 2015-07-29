'use strict';

var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    BaseModel = require('./baseModel');

var AppUser = module.exports = BaseModel.extend({

    initialize: function() {
        this._throttleSave = _.throttle(this._save.bind(this), 5000);
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
        return !this._lastPropertyValues || _.some(AppUser.EDITABLE_PROPERTIES, function(property) {
            return this._lastPropertyValues[property] !== this.get(property);
        }.bind(this));
    },

    _save: function(attributes, options) {
        attributes || (attributes = {});
        options || (options = {});

        if (this.isDirty()) {
            var success = options && options.success;
            options.success = _.bind(function(model, response, options) {
                this._lastPropertyValues = this.pick(AppUser.EDITABLE_PROPERTIES);
                success && success(model, response, options);
            }, this);
            return Backbone.Model.prototype.save.call(this, attributes, options);
        } else {
            return $.Deferred().resolve(this, null, null);
        }
    },

    save: function(attributes, options) {
        return this._throttleSave.call(this, attributes, options);
    }
}, {
    EDITABLE_PROPERTIES: [
        'givenName',
        'surname',
        'email',
        'properties'
    ]
});
