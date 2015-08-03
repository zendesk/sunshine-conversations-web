'use strict';

var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');

var BaseModel = require('./baseModel');


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

    isDirty: function(attributes) {
        attributes || (attributes = {});

        var comparableAttributes = _.extend({}, this.attributes, attributes);

        return !this._lastPropertyValues || _.some(AppUser.EDITABLE_PROPERTIES, function(property) {
            return !_.isEqual(this._lastPropertyValues[property], comparableAttributes[property]);
        }.bind(this));
    },

    _save: function(attributes, options) {
        attributes || (attributes = {});
        options || (options = {});

        var success = options && options.success;
        if (this.isDirty(attributes)) {
            options.success = _.bind(function(model, response, options) {
                this._lastPropertyValues = this.pick(AppUser.EDITABLE_PROPERTIES);
                success && success(model, response, options);
            }, this);

            return Backbone.Model.prototype.save.call(this, attributes, options);
        } else {
            success && success(this, null, null);

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
