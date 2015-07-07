'use strict';

var _ = require('underscore');

var ViewController = require('view-controller');

var SettingsView = require('../views/settingsView');

module.exports = ViewController.extend({
    viewClass: SettingsView,

    viewTriggers: {
        'settings:close': 'settings:close'
    },

    viewEvents: {
        'settings:save': 'onSettingsSave'
    },

    initialize: function() {
        this.savedEmail = this.model.get('email');
        this.isDirty = false;

        this.listenTo(this.model, 'change:email', this.onEmailChange);
    },

    onSettingsSave: function() {
        this.model.save({
            wait: true
        }).then(_(function() {
            this.isDirty = false;
            this.savedEmail = this.model.get('email');
            this.view.showSavedMessage();
        }).bind(this));
    },

    onEmailChange: function() {
        this.isDirty = true;
    },

    onDestroy: function() {
        if (this.isDirty) {
            this.model.set('email', this.savedEmail);
        }
    }
});
