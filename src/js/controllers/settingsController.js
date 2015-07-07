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

    onSettingsSave: function() {
        this.model.save({wait: true}).then(_(function() {
            this.view.showSavedMessage();
        }).bind(this));
    }
});
