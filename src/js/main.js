'use strict';

require('./bootstrap');

var Backbone = require('backbone'),
    Marionette = require('backbone.marionette'),
    _ = require('underscore'),
    $ = require('jquery'),
    cookie = require('cookie'),
    uuid = require('uuid');


var endpoint = require('./endpoint'),
    vent = require('./vent'),
    faye = require('./faye');

var ChatController = require('./controllers/chatController'),
    Message = require('./models/message'),
    Conversations = require('./collections/conversations');

// appends the compile stylesheet to the HEAD
require('../stylesheets/main.less');

/**
 * Contains all SupportKit API classes and functions.
 * @name SupportKit
 * @namespace
 *
 * Contains all SupportKit API classes and functions.
 */
var SupportKit = Marionette.Object.extend({
    VERSION: '1.0.0',

    initialize: function() {

        // for backward compatibility
        this.ui = {
            open: this.open.bind(this),
            close: this.open.bind(this),
            toggle: this.open.bind(this)
        };

        this.conversations = new Conversations();

        this.chatController = new ChatController({
            collection: this.conversations
        });

        _.bindAll(this,
            'init',
            'open',
            'close',
            'toggle',
            'resetUnread',
            'message'
        );
    },

    _checkReady: function(message) {
        if (!this.ready) {
            throw new Error(message || "Can't use this function until the SDK is ready.");
        }
    },

    _updateUser: function() {
        if (_.isEmpty(this.user)) {
            return $.Deferred().resolve();
        } else {
            this.user.properties = this.user.properties || {};
            return endpoint.put('/api/appusers/' + endpoint.appUserId, this.user);
        }
    },

    init: function(options) {
        this.ready = false;
        options = options || {};

        this.user = _.pick(options, 'givenName', 'surname', 'email', 'properties');

        if (typeof options === 'object') {
            endpoint.appToken = options.appToken;
        } else if (typeof options === 'string') {
            endpoint.appToken = options;
        } else {
            throw new Error('init method accepts an object or string');
        }

        if (!endpoint.appToken) {
            throw new Error('init method requires an appToken');
        }

        // TODO: Allow options to override the deviceId
        var deviceId = cookie.parse(document.cookie)['sk_deviceid'];
        if (!deviceId) {
            deviceId = uuid.v4().replace(/-/g, '');
            document.cookie = 'sk_deviceid=' + deviceId;
        }
        this.deviceId = deviceId;

        endpoint.post('/api/appboot', {
            deviceId: this.deviceId,
            deviceInfo: {
                URL: document.location.host,
                userAgent: navigator.userAgent,
                referrer: document.referrer,
                browserLanguage: navigator.language,
                currentUrl: document.location.href,
                currentTitle: document.title
            }
        })
            .then(function(res) {
                endpoint.appUserId = res.appUserId;
                return this._updateUser.bind(this);
            }.bind(this))
            .then(function() {
                // Tell the world we're ready
                this.ready = true;
                this.triggerMethod('ready');
            }.bind(this));
    },

    resetUnread: function() {
        this.conversation.resetUnread();
    },

    message: function(text) {
        this._checkReady('Can not send messages until init has completed');
        this.chatController.sendMessage(text);
    },

    open: function() {
        this._checkReady();
        this.chatController.open();
    },

    close: function() {
        this._checkReady();
        this.chatController.close();
    },

    toggle: function() {
        this._checkReady();
        this.chatController.toggle();
    },

    onReady: function() {
        var view = this.chatController.getView();
        $('body').append(view.render().el);
    }
});

module.exports = global.SupportKit = new SupportKit();