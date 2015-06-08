var Marionette = require('backbone.marionette');

var template = require('../../templates/header.tpl');

module.exports = Marionette.ItemView.extend({
    id: 'sk-header',

    triggers: {
        'click': 'toggle'
    },

    template: template,

    ui: {
        badge: '[data-ui-badge]'
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

    headerText: 'How can we help?',

    isBadgeVisible: function(val) {
        return val > 0;
    },

    serializeData: function() {
        return {
            headerText: this.getOption('headerText')
        };
    }
});
