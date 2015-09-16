/* global global:false */
'use strict';
require('./bootstrap');

var Marionette = require('backbone.marionette');
var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var cookie = require('cookie');
var uuid = require('uuid');
var urljoin = require('url-join');
var bindAll = require('lodash.bindall');

var BaseCollection = require('./collections/baseCollection');
/*jshint -W079 */
var Event = require('./models/event');
/*jshint +W079 */
var Rule = require('./models/rule');
var AppUser = require('./models/appUser');
var ChatController = require('./controllers/chatController');
var Conversations = require('./collections/conversations');
var endpoint = require('./endpoint');

var SK_STORAGE = 'sk_deviceid';

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
    VERSION: '0.2.30',

    defaultText: {
        headerText: 'How can we help?',
        inputPlaceholder: 'Type a message...',
        sendButtonText: 'Send',
        introText: 'This is the beginning of your conversation.<br/> Ask us anything!',
        settingsText: 'You can leave us your email so that we can get back to you this way.',
        settingsReadOnlyText: 'We\'ll get back to you at this email address if we missed you.',
        settingsInputPlaceholder: 'Your email address',
        settingsSaveButtonText: 'Save',
        settingsHeaderText: 'Email Settings',
        settingsNotificationText: 'In case we\'re slow to respond you can <a href="#" data-ui-settings-link>leave us your email</a>.'
    },

    initialize: function() {
        bindAll(this);
        this._readyPromise = $.Deferred();
        this._conversations = new Conversations();
    },

    _checkReady: function(message) {
        if (!this.ready) {
            throw new Error(message || 'Can\'t use this function until the SDK is ready.');
        }
    },

    init: function(options) {
        if (this.ready) {
            return;
        }


        if (/lebo|awle|pide|obo|rawli/i.test(navigator.userAgent)) {
            var link = $('<a>')
                .attr('href', 'https://supportkit.io?utm_source=widget')
                .text('In app messaging by supportkit');

            $(function() {
                $('body').append(link);
            });

            this.ready = true;
            return;
        }

        // TODO: alternatively load fallback CSS that doesn't use
        // unsupported things like transforms
        if (!$.support.cssProperty('transform')) {
            console.error('SupportKit is not supported on this browser. ' +
                'Missing capability: css-transform');
            return;
        }

        this.ready = false;
        options = options || {};

        options = _.defaults(options, {
            emailCaptureEnabled: false
        });

        if (typeof options === 'object') {
            endpoint.appToken = options.appToken;
            endpoint.jwt = options.jwt;
            if (options.serviceUrl) {
                endpoint.rootUrl = options.serviceUrl;
            }
        } else if (typeof options === 'string') {
            endpoint.appToken = options;
        } else {
            throw new Error('init method accepts an object or string');
        }

        if (!endpoint.appToken) {
            throw new Error('init method requires an appToken');
        }

        this.deviceId = this.getDeviceId();

        endpoint.post('/api/appboot', {
            deviceId: this.deviceId,
            userId: options.userId,
            deviceInfo: {
                URL: document.location.host,
                userAgent: navigator.userAgent,
                referrer: document.referrer,
                browserLanguage: navigator.language,
                currentUrl: document.location.href,
                sdkVersion: this.VERSION,
                currentTitle: document.title,
                platform: 'web'
            }
        })
            .then(_(function(res) {
                this.user = new AppUser({
                    id: res.appUserId
                });

                var EventCollection = BaseCollection.extend({
                    url: urljoin('appusers', res.appUserId, 'event'),
                    model: Event
                });

                var RuleCollection = Backbone.Collection.extend({
                    model: Rule
                });

                // this._events overrides some internals for event bindings in Backbone
                this._eventCollection = new EventCollection(res.events, {
                    parse: true
                });

                // for consistency, this will use the collection suffix too.
                this._ruleCollection = new RuleCollection(res.rules, {
                    parse: true
                });

                endpoint.appUserId = res.appUserId;

                // if the email was passed at init, it can't be changed through the web widget UI
                var readOnlyEmail = !_.isEmpty(options.email);
                var emailCaptureEnabled = options.emailCaptureEnabled && !readOnlyEmail;
                var uiText = _.extend({}, this.defaultText, options.customText);

                this._chatController = new ChatController({
                    collection: this._conversations,
                    user: this.user,
                    readOnlyEmail: readOnlyEmail,
                    emailCaptureEnabled: emailCaptureEnabled,
                    uiText: uiText
                });

                return this.user.save(_.pick(options, AppUser.EDITABLE_PROPERTIES), {
                    parse: true,
                    wait: true
                });
            }).bind(this))
            .then(_(function() {
                this._renderWidget();
            }).bind(this))
            .fail(function(err) {
                var message = err && (err.message || err.statusText);
                console.error('SupportKit init error: ', message);
            })
            .done();

        return this._readyPromise;
    },

    logout: function() {
        this.destroy();
    },

    getDeviceId: function() {
        var deviceId;

        // get device ID first from local storage, then cookie. Otherwise generate new one
        deviceId = localStorage.getItem(SK_STORAGE) ||
            cookie.parse(document.cookie)[SK_STORAGE] ||
            uuid.v4().replace(/-/g, '');

        // reset the cookie and local storage
        document.cookie = SK_STORAGE + '=' + deviceId;
        localStorage.setItem(SK_STORAGE, deviceId);

        return deviceId;
    },

    resetUnread: function() {
        this._checkReady();
        this._chatController.resetUnread();
    },

    sendMessage: function(text) {
        this._checkReady('Can not send messages until init has completed');
        return this._chatController.sendMessage(text);
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
        if (typeof userInfo !== 'object') {
            return $.Deferred().reject(new Error('updateUser accepts an object as parameter'));
        }

        return this.user.save(userInfo, {
            parse: true,
            wait: true
        }).then(function() {
            return this.user;
        }.bind(this));
    },

    track: function(eventName) {
        this._checkReady();

        var rulesContainEvent = this._rulesContainEvent(eventName);

        if (rulesContainEvent) {
            this._eventCollection.create({
                name: eventName,
                user: this.user
            }, {
                success: _.bind(this._checkConversationState, this)
            });
        } else {
            this._ensureEventExists(eventName);
        }
    },

    _ensureEventExists: function(eventName) {
        var hasEvent = this._hasEvent(eventName);

        if (!hasEvent) {
            endpoint.put('api/event', {
                name: eventName
            }).then(_.bind(function() {
                this._eventCollection.add({
                    name: eventName,
                    user: this.user
                });
            }, this))
                .done();
        }
    },

    _rulesContainEvent: function(eventName) {
        return !!this._ruleCollection.find(function(rule) {
            return !!rule.get('events').findWhere({
                name: eventName
            });
        });
    },

    _hasEvent: function(eventName) {
        return eventName === 'skt-appboot' || !!this._eventCollection.findWhere({
            name: eventName
        });
    },

    _checkConversationState: function() {
        if (!this._chatController.conversation || this._chatController.conversation.isNew()) {
            this._chatController._initConversation();
        }
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
        this.track('skt-appboot');
        this._readyPromise.resolve();
    },

    onDestroy: function() {
        if (this.ready) {
            this._ruleCollection.reset();
            this._eventCollection.reset();
            this._conversations.reset();
            this._chatController.destroy();

            this._readyPromise = $.Deferred();

            endpoint.reset();

            this.ready = false;
        }
    }
});

module.exports = global.SupportKit = new SupportKit();
