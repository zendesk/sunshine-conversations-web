/* global global:false */

'use strict';

require('./bootstrap');

var Backbone = require('backbone'),
    Marionette = require('backbone.marionette'),
    _ = require('underscore'),
    $ = require('jquery'),
    cookie = require('cookie'),
    uuid = require('uuid'),
    bindAll = require('lodash.bindall');


var endpoint = require('./endpoint'),
    vent = require('./vent'),
    faye = require('./faye');

var ChatController = require('./controllers/chatController'),
    Message = require('./models/message'),
    Conversations = require('./collections/conversations'),
    AppUser = require('./models/appUser');

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
    VERSION: '0.2.0',

    defaultText: {
        headerText: 'How can we help?',
        inputPlaceholder: 'Type a message...',
        sendButtonText: 'Send',
        introText: 'This is the beginning of your conversation.<br/> Ask us anything!'
    },

    initialize: function() {
        bindAll(this);

        this._conversations = new Conversations();
    },

    _checkReady: function(message) {
        if (!this.ready) {
            throw new Error(message || 'Can\'t use this function until the SDK is ready.');
        }
    },

    _updateUser: function(userInfo) {
        return this.user.save();
    },

    init: function(options) {
        this.ready = false;
        options = options || {};

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

        var uiText = _.extend({}, this.defaultText, options.customText);

        this._chatController = new ChatController({
            collection: this._conversations,
            uiText: uiText
        });

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
            .then(_(function(res) {
                this.user = new AppUser({
                    id: res.appUserId
                });

                endpoint.appUserId = res.appUserId;

                return this.updateUser(_.pick(options, 'givenName', 'surname', 'email', 'properties'));
            }).bind(this))
            .then(_(function() {
                this._renderWidget();
            }).bind(this))
            .done();
    },

    resetUnread: function() {
        this._checkReady();
        this._chatController._resetUnread();
    },

    sendMessage: function(text) {
        this._checkReady('Can not send messages until init has completed');
        this._chatController.sendMessage(text);
    },

    open: function() {
        this._checkReady();
        this._chatController.open();
    },

    close: function() {
        this._checkReady();
        this._chatController.close();
    },

    updateUser: function(userInfo) {
        var userChanged = false;

        if (typeof userInfo !== 'object') {
            throw new Error('updateUser accepts an object as parameter');
        }

        userInfo.id = this.user.id;

        userChanged = userChanged || (userInfo.givenName && this.user.get('givenName') !== userInfo.givenName);
        userChanged = userChanged || (userInfo.surname && this.user.get('surname') !== userInfo.surname);
        userChanged = userChanged || (userInfo.email && this.user.get('email') !== userInfo.email);

        if (!userChanged && userInfo.properties) {
            var props = this.user.get('properties');
            _.each(userInfo.properties, function(value, key) {
                userChanged = userChanged || value !== props[key];
            });
        }

        if (!userChanged) {
            return $.Deferred().resolve();
        }

        this.user = new AppUser(userInfo);

        this.throttledUpdate = this.throttledUpdate || _.throttle(this._updateUser.bind(this), 60000);
        return this.throttledUpdate();
    },

    _renderWidget: function() {
        this._chatController.getWidget().then(_.bind(function(widget) {
            $('body').append(widget.el);


            _(function() {
                this._chatController.scrollToBottom();
            }).chain().bind(this).delay();

            // Tell the world we're ready
            this.triggerMethod('ready');
        }, this));

    },
    onReady: function() {
        this.ready = true;
    }
});

module.exports = global.SupportKit = new SupportKit();
