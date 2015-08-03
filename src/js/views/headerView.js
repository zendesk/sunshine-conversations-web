'use strict';

var Marionette = require('backbone.marionette');

var template = require('../../templates/header.tpl');

module.exports = Marionette.ItemView.extend({
    id: 'sk-header',

    triggers: {
        'click': 'toggle',
        'click @ui.notificationBadge': 'notification:click'
    },

    template: template,

    ui: {
        badge: '[data-ui-badge]',
        notificationBadge: '[data-ui-notification-badge]'
    },

    behaviors: {
        stickit: {
            '@ui.badge': {
                observe: 'unread',
                visible: 'isBadgeVisible',
                updateView: true
            }
        }
    },

    isBadgeVisible: function(val) {
        return val > 0;
    },

    serializeData: function() {
        return {
            headerText: this.getOption('headerText'),
            emailCaptureEnabled: this.getOption('emailCaptureEnabled')
        };
    }
});
