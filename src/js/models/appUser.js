/* global Promise:false */
'use strict';

var _ = require('underscore');
var Backbone = require('backbone-associations');

var AppUser = module.exports = Backbone.AssociatedModel.extend({
    idAttribute: '_id',

    initialize: function() {
        this._throttleSave = _.throttle(this._save.bind(this), 5000);
    },

    parse: function(data) {
        return _.isObject(data) ? data : {
            _id: data
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
        return new Promise(function(resolve) {

            if (this.isDirty(attributes)) {
                options.success = _.bind(function(model, response, options) {
                    this._lastPropertyValues = this.pick(AppUser.EDITABLE_PROPERTIES);
                    success && success(model, response, options);
                    resolve(model, response, options);
                }, this);

                return Backbone.Model.prototype.save.call(this, attributes, options);
            } else {
                success && success(this, null, null);
                return resolve(this, null, null);
            }
        }.bind(this));
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
