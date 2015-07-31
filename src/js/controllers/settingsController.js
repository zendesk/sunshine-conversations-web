'use strict';
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

    viewOptions: {
        readOnlyEmail: false
    },

    modelEvents: {
        'change:email': 'onEmailChange',
        sync: 'onModelSync'
    },

    initialize: function() {
        this.savedEmail = this.model.get('email');
        this.isDirty = false;
    },

    onSettingsSave: function() {
        this.listenToOnce(this.model, 'sync', function() {
            this.view.showSavedMessage();
        });

        // bypass throttling
        this.model._save({}, {
            wait: true
        });
    },

    onEmailChange: function() {
        this.isDirty = true;
    },

    onModelSync: function() {
        this.isDirty = false;
        this.savedEmail = this.model.get('email');
    },

    onDestroy: function() {
        if (this.isDirty) {
            this.model.set('email', this.savedEmail);
        }
    }
});
