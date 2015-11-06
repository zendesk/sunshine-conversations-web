'use strict';

var Backbone = require('backbone-associations');
var urljoin = require('urljoin');

var IdModel = require('./idModel');
var Messages = require('../collections/messages');

module.exports = Backbone.AssociatedModel.extend({
    idAttribute: '_id',

    parse: function(data) {
        return data.conversation;
    },

    defaults: function() {
        return {
            unread: 0,
            messages: [],
            appUsers: [],
            appMakers: []
        };
    },

    relations: [
        {
            type: Backbone.Many,
            key: 'messages',
            collectionType: function() {
                var model = this;
                return Messages.extend({
                    url: function() {
                        return urljoin(model.url(), '/messages/');
                    }
                });
            }
        },
        {
            type: Backbone.Many,
            key: 'appMakers',
            relatedModel: IdModel
        },
        {
            type: Backbone.Many,
            key: 'appUsers',
            relatedModel: IdModel
        }
    ]
});
