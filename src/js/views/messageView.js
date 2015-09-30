var Marionette = require('backbone.marionette');
var urljoin = require('urljoin');
var $ = require('jquery');
var _ = require('underscore');

var htmlUtils = require('../utils/html');

var template = require('../../templates/message.tpl');
var endpoint = require('../endpoint');

module.exports = Marionette.ItemView.extend({
    template: template,
    className: function() {
        return 'sk-row ' + (this._isAppMaker() ? 'sk-left-row' : 'sk-right-row');
    },

    ui: {
        name: '[data-ui-name]',
        message: '[data-ui-message]',
        avatar: '[data-ui-avatar]',
        action: '.sk-action'
    },

    events: {
        'mouseup @ui.action': 'onActionMouseup'
    },

    behaviors: {
        stickit: {
            '@ui.name': {
                observe: 'name',
                onGet: function(value) {
                    return this._isAppMaker() ? value : '';
                }
            },
            '@ui.message': {
                observe: ['text', 'actions'],
                update: function($el, values) {
                    if (values[0].trim().length > 0) {

                        var escapedText = $('<div/>').text(values[0]).html().replace(/\n/g, '<br />');

                        escapedText = htmlUtils.autolink(escapedText, {
                            class: 'link',
                            target: '_blank'
                        });

                        if (values[1] && values[1].length > 0) {
                            $el.addClass('has-actions');
                        }

                        $el.html(escapedText);
                    }
                }
            },
            '@ui.avatar': {
                observe: ['avatarUrl', 'authorId'],
                update: function($el, values) {
                    var url = values[0];
                    var id = values[1];
                    if (this._isAppMaker()) {
                        url = url || urljoin(endpoint.rootUrl, '/api/users/', id, '/avatar');
                        $el.attr('src', url);
                    }
                },
                visible: function() {
                    return this._isAppMaker();
                },
                updateView: true
            }
        }
    },

    _isAppMaker: function() {
        var appMakers = this.getOption('conversation').get('appMakers');

        return !!appMakers.findWhere({
            id: this.model.get('authorId')
        });
    },

    serializeData: function() {
        var data = Marionette.ItemView.prototype.serializeData.call(this);

        return _.defaults(data, {
            actions: []
        });
    },

    // Actions were remaining focused on mouseup, causing strange coloration until blurred
    onActionMouseup: function(e) {
        $(e.target).blur();
    }
});
