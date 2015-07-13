'use strict';

var _ = require('underscore'),
    $ = require('jquery'),
    BaseModel = require('./baseModel');

var AppUserModel = module.exports = BaseModel.extend({
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

        _.each(AppUserModel.EDITABLE_PROPERTIES, function(property) {
            hasChanged = hasChanged || this.hasChanged(property);
        }.bind(this));

        return hasChanged;
    },

    saveIfDirty: function() {
        if (this.isDirty()) {
            return this.save();
        } else {
            return $.Deferred().resolve().promise();
        }
    }
}, {
    EDITABLE_PROPERTIES: ['givenName',
        'surname',
        'email',
        'properties']
});
