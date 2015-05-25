'use strict';

var _ = require('underscore'),
    Backbone = require('backbone'),
    urljoin = require('url-join');

var BaseModel = require('./baseModel'),
    Messages = require('../collections/messages');

var vent = require('../vent'),
    endpoint = require('../endpoint');

module.exports = BaseModel.extend({
    idAttribute: '_id',
    urlRoot: urljoin(endpoint.rootUrl, 'api/conversations/'),

    defaults: function() {
        return {
            unread: 0,
            messages: [],
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
                        return urljoin(model.url(), '/messages/')
                    }
                })
            }
        },
        {
            type: Backbone.Many,
            key: 'appMakers',
            relatedModel: Backbone.AssociatedModel
        }
    ]


});