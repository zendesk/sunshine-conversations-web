/* global global:false, Promise:false */
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

/*jshint -W079 */
var Event = require('./models/event');
/*jshint +W079 */
var Rule = require('./models/rule');
var AppUser = require('./models/appUser');
var ChatController = require('./controllers/chatController');
var endpoint = require('./endpoint');
var api = require('./utils/api');

var SK_STORAGE = 'sk_deviceid';

// appends the compile stylesheet to the HEAD
require('../stylesheets/main.less');


var EventCollection = Backbone.Collection.extend({
    model: Event
});

var RuleCollection = Backbone.Collection.extend({
    model: Rule
});

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
        this._widgetRendered = false;

        this.user = new AppUser();

        this._eventCollection = new EventCollection();
        this._ruleCollection = new RuleCollection();
    },

    _checkReady: function(message) {
        if (!this.ready) {
            throw new Error(message || 'Can\'t use this function until the SDK is ready.');
        }
    },

    init: function(options) {
        return new Promise(function(resolve, reject) {
            if (this.ready) {
                return resolve();
            }

            if (/lebo|awle|pide|obo|rawli/i.test(navigator.userAgent)) {
                var link = $('<a>')
                    .attr('href', 'https://supportkit.io?utm_source=widget')
                    .text('In app messaging by supportkit');

                $(function() {
                    $('body').append(link);
                });

                this.ready = true;
                return resolve();
            }

            // TODO: alternatively load fallback CSS that doesn't use
            // unsupported things like transforms
            if (!$.support.cssProperty('transform')) {
                return reject(new Error('SupportKit is not supported on this browser. ' +
                        'Missing capability: css-transform'));
            }


            this.ready = false;
            options = options || {};

            // if the email was passed at init, it can't be changed through the web widget UI
            var readOnlyEmail = !_.isEmpty(options.email);
            var emailCaptureEnabled = options.emailCaptureEnabled && !readOnlyEmail;
            var uiText = _.extend({}, this.defaultText, options.customText);

            this.options = _.defaults(options, {
                emailCaptureEnabled: emailCaptureEnabled,
                readOnlyEmail: readOnlyEmail,
                uiText: uiText
            });

            if (typeof options === 'string') {
                options = {
                    appToken: options
                };
            }

            if (typeof options === 'object') {
                endpoint.appToken = options.appToken;
            } else {
                return reject(new Error('init method accepts an object or string'));
            }

            if (!endpoint.appToken) {
                return reject(new Error('init method requires an appToken'));
            }

            resolve(this.login(options.userId, options.jwt));

        }.bind(this));
    },

    login: function(userId, jwt) {
        this._cleanState();

        var data = {
            deviceId: this.getDeviceId(),
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
        };

        if (userId) {
            data.userId = userId;
        }

        if (jwt) {
            endpoint.jwt = jwt;
        }

        return api.call({
            url: 'appboot',
            method: 'POST',
            data: data
        })
            .then(_(function(res) {
                this.user.set(res.appUser);
                endpoint.appUserId = this.user.id;

                this._eventCollection.url = urljoin('appusers', this.user.id, 'event');

                // this._events overrides some internals for event bindings in Backbone
                this._eventCollection.reset(res.events, {
                    parse: true
                });

                // for consistency, this will use the collection suffix too.
                this._ruleCollection.reset(res.rules, {
                    parse: true
                });

                return this.user.save(_.pick(this.options, AppUser.EDITABLE_PROPERTIES), {
                    parse: true,
                    wait: true
                });
            }).bind(this))
            .then(_(function() {
                return this._renderWidget();
            }).bind(this))
            .catch(function(err) {
                var message = err && (err.message || err.statusText);
                console.error('SupportKit init error: ', message);
            });
    },

    logout: function() {
        return Promise.resolve(this.ready ? this.login() : undefined);
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
            return new Promise(function(resolve, reject) {
                reject(new Error('updateUser accepts an object as parameter'));
            });
        }
        var user = this.user;

        return new Promise(function(resolve, reject) {
            user.save(userInfo, {
                parse: true,
                wait: true
            }).then(function() {
                resolve(user);
            }).catch(reject);
        });
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
            api.call({
                url: 'event',
                method: 'PUT',
                data: {
                    name: eventName
                }
            }).then(_.bind(function() {
                this._eventCollection.add({
                    name: eventName,
                    user: this.user
                });
            }, this));
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
        this._chatController = new ChatController({
            user: this.user,
            readOnlyEmail: this.options.readOnlyEmail,
            emailCaptureEnabled: this.options.emailCaptureEnabled,
            uiText: this.options.uiText
        });

        return this._chatController.getWidget().then(function(widget) {
            $('body').append(widget.el);
            this._widgetRendered = true;

            _(function() {
                this._chatController.scrollToBottom();
            }).chain().bind(this).delay();

            this.triggerMethod('ready');
            return;
        }.bind(this));
    },

    _cleanState: function() {
        this.user.clear();
        this._ruleCollection.reset();
        this._eventCollection.reset();

        if (this._widgetRendered) {
            this._chatController.destroy();
        }

        endpoint.reset();
        this.ready = false;
        this._widgetRendered = false;
    },

    onReady: function() {
        this.ready = true;
        this.track('skt-appboot');
    },

    onDestroy: function() {
        this._cleanState();
        delete endpoint.appToken;
    }
});

module.exports = global.SupportKit = new SupportKit();
