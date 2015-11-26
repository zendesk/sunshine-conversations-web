'use strict';

var bindAll = require('lodash.bindall');
var _ = require('underscore');
var ViewController = require('view-controller');

var endpoint = require('../endpoint');
var vent = require('../vent');
var faye = require('../faye');
var storage = require('../utils/localStorage');

var ChatView = require('../views/chatView');
var HeaderView = require('../views/headerView');
var ConversationView = require('../views/conversationView');
var SettingsHeaderView = require('../views/settingsHeaderView');
var EmailNotificationView = require('../views/emailNotificationView');

var ChatInputController = require('../controllers/chatInputController');
var SettingsController = require('../controllers/settingsController');

var initialScreenSize;

module.exports = ViewController.extend({
    viewClass: ChatView,

    viewEvents: {
        focus: 'resetUnread'
    },

    initialize: function() {
        bindAll(this);
        this.isOpened = false;
        this.fayeConnected = false;
        this.uiText = this.getOption('uiText') || {};
    },

    open: function() {
        if (!!this.view && !!this.chatInputController && !this.isOpened) {
            this.isOpened = true;
            this.view.open();
            this.conversationView.positionLogo();

            if (!this.isMobileDevice()) {
                this.chatInputController.focus();
            }
        }
    },

    close: function() {
        if (!!this.view && this.isOpened) {
            this.isOpened = false;
            this.view.close();
            this.resetUnread();
        }
    },

    toggle: function() {
        if (this.isOpened) {
            this.close();
        } else {
            this.open();
        }
    },

    sendMessage: function(text) {
        var self = this;
        return self.model._save({}, {
            wait: true
        }).then(function() {
            return self.model.get('conversation');
        }).then(function(conversation) {
            return new Promise(function(resolve, reject) {
                conversation.get('messages').create({
                    text: text,
                    role: 'appUser'
                }, {
                    success: function(message, resp) {
                        self.trigger('message:sent', message.toJSON());
                        conversation.set(_.omit(['messages'], resp.conversation));
                        conversation.get('messages').add(resp.conversation.messages, {
                            merge: true
                        });

                        self.model.set({
                            'conversationStarted': true
                        });

                        self._initFaye(conversation).then(function() {
                            resolve(message);
                        });
                    },
                    error: reject
                });
            }).then(function(message) {
                var appUserMessages = conversation.get('messages').filter(function(message) {
                    return message.get('role') === 'appUser';
                });

                if (self.getOption('emailCaptureEnabled') &&
                    appUserMessages.length === 1 &&
                    !self.model.get('email')) {
                    self._showEmailNotification();
                }

                return message;
            });
        });

    },

    scrollToBottom: function() {
        if (this.conversationView && !this.conversationView.isDestroyed) {
            this.conversationView.scrollToBottom();
        }
    },

    _showEmailNotification: function() {
        var view = new EmailNotificationView({
            settingsNotificationText: this.uiText.settingsNotificationText
        });

        this.listenTo(view, 'notification:close', this._hideEmailNotification);
        this.listenTo(view, 'settings:navigate', this._showSettings);

        this.listenToOnce(view, 'destroy', function() {
            this.stopListening(view);
        });

        this.getView().notifications.show(view);
    },

    _hideEmailNotification: function() {
        this.getView().notifications.empty();
    },

    _showSettings: function() {
        this._hideEmailNotification();
        this._renderSettingsHeader();
        this._renderSettingsView();
    },

    _hideSettings: function() {
        this.getView().settings.empty();
        this._renderChatHeader();
    },

    _receiveMessage: function(message) {
        this.trigger('message:received', message);
        return Promise.resolve(this.model.get('conversation').get('messages').add(message, {
            merge: true
        }));
    },

    _initFaye: function(conversation) {
        if (!this.fayeConnected) {
            var promise;

            if (conversation.isNew() && this.model.get('conversationStarted')) {
                // need to fetch it to get the conversation id
                promise = conversation.fetch();
            } else {
                promise = Promise.resolve();
            }

            return promise.then(function() {
                return faye.init(conversation.id).then(function(data) {
                    this._fayeSubscription = data.subscription;
                    this.fayeConnected = true;

                    _.defer(function() {
                        // fetch the conversation right after
                        // connecting faye to make sure nothing was missed
                        conversation.fetch();
                    });

                    return conversation;
                }.bind(this));
            }.bind(this));
        }

        return Promise.resolve(conversation);
    },

    _initConversation: function() {
        var conversation = this.model.get('conversation');

        return this.model.get('conversationStarted') ?
            conversation.fetch()
                .then(_.constant(conversation))
                .then(this._initFaye) :
            Promise.resolve(conversation);
    },

    _initMessagingBus: function(conversation) {
        this.listenTo(vent, 'receive:message', this._receiveMessage);
        return conversation;
    },

    _manageUnread: function(conversation) {
        this._updateUnread();
        this.listenTo(conversation.get('messages'), 'add', this._updateUnread);
        return conversation;
    },

    _renderChatHeader: function() {
        var headerView = new HeaderView({
            model: this.model.get('conversation'),
            headerText: this.uiText.headerText,
            emailCaptureEnabled: this.getOption('emailCaptureEnabled')
        });

        this.listenTo(headerView, 'toggle', this.toggle);
        this.listenTo(headerView, 'notification:click', this._showSettings);

        this.listenTo(headerView, 'destroy', function() {
            this.stopListening(headerView);
        });

        this.getView().header.show(headerView);
    },

    _renderSettingsHeader: function() {
        var settingsHeaderView = new SettingsHeaderView({
            settingsHeaderText: this.uiText.settingsHeaderText
        });
        this.listenTo(settingsHeaderView, 'settings:close', this._hideSettings);
        this.listenTo(settingsHeaderView, 'widget:close', function() {
            this.toggle();
            this._hideSettings();
        });

        this.listenToOnce(settingsHeaderView, 'destroy', function() {
            this.stopListening(settingsHeaderView);
        });

        this.getView().header.show(settingsHeaderView);
    },

    _renderSettingsView: function() {
        var settingsController = new SettingsController({
            model: this.model,
            viewOptions: {
                emailCaptureEnabled: this.getOption('emailCaptureEnabled'),
                readOnlyEmail: this.getOption('readOnlyEmail'),
                settingsText: this.uiText.settingsText,
                settingsReadOnlyText: this.uiText.settingsReadOnlyText,
                settingsInputPlaceholder: this.uiText.settingsInputPlaceholder,
                settingsSaveButtonText: this.uiText.settingsSaveButtonText
            }
        });

        this.listenToOnce(settingsController, 'settings:close', this._hideSettings);

        this.listenToOnce(settingsController, 'destroy', function() {
            this.stopListening(settingsController);
        });

        this.getView().settings.show(settingsController.getView());
    },

    _renderConversation: function() {
        this.conversationView = new ConversationView({
            collection: this.model.get('conversation').get('messages'),
            introText: this.uiText.introText
        });

        if (this.isMobileDevice()) {
            this.listenTo(this.conversationView, 'render', function() {
                // From: http://stackoverflow.com/questions/11600040/jquery-js-html5-change-page-content-when-keyboard-is-visible-on-mobile-devices
                initialScreenSize = window.innerHeight;

                /* Android */
                window.addEventListener('resize', function() {
                    this.keyboardToggled(window.innerHeight < initialScreenSize);
                }.bind(this), false);
            });
        }

        this.getView().main.show(this.conversationView);
    },

    _renderConversationInput: function() {
        this.chatInputController = new ChatInputController({
            model: this.model.get('conversation'),
            collection: this.model.get('conversation').get('messages'),
            viewOptions: {
                inputPlaceholder: this.uiText.inputPlaceholder,
                sendButtonText: this.uiText.sendButtonText
            }
        });

        this.listenTo(this.chatInputController, 'message:send', this.sendMessage);
        this.listenTo(this.chatInputController, 'message:read', this.resetUnread);

        this.getView().footer.show(this.chatInputController.getView());
    },

    _renderWidget: function() {
        this._renderChatHeader();
        this._renderConversation();
        this._renderConversationInput();
    },

    getWidget: function() {
        var view = this.getView();

        if (view.isRendered) {
            return Promise.resolve(view);
        }

        // this a workaround for rendering layout views and fixing regions
        // seems to be a lot of issues around layout views rendering...
        // https://github.com/marionettejs/backbone.marionette/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+layout+render
        view.render()._reInitializeRegions();

        return this._initConversation()
            .then(this._initMessagingBus)
            .then(this._manageUnread)
            .then(this._renderWidget)
            .then(function() {
                return view;
            });
    },

    _getLatestReadTimeKey: function() {
        return 'sk_latestts_' + (endpoint.userId || 'anonymous');
    },

    _getLatestReadTime: function() {
        var key = this._getLatestReadTimeKey();
        var latestReadTs;
        try {
            latestReadTs = parseInt(storage.getItem(key) || 0);
        }
        catch (e) {
            latestReadTs = 0;
        }
        return latestReadTs;
    },

    _setLatestReadTime: function(ts) {
        var key = this._getLatestReadTimeKey();
        storage.setItem(key, ts);
    },

    _updateUnread: function() {
        var latestReadTs = this._getLatestReadTime();
        var unreadMessages = this.model.get('conversation').get('messages').chain()
            .filter(function(message) {
                return message.get('role') !== 'appUser' && Math.floor(message.get('received')) > latestReadTs;
            })
            .value();

        if (this.unread !== unreadMessages.length) {
            this.model.get('conversation').set('unread', unreadMessages.length);
        }
    },

    clearUnread: function() {
        var key = this._getLatestReadTimeKey();
        storage.removeItem(key);
    },

    resetUnread: function() {
        var latestReadTs = 0;
        var latestMessage = this.model.get('conversation').get('messages').max(function(message) {
            return message.get('received');
        });

        if (latestMessage !== -Infinity) {
            latestReadTs = Math.floor(latestMessage.get('received'));
        }
        this._setLatestReadTime(latestReadTs);
        this._updateUnread();
    },

    keyboardToggled: function(isKeyboardShown) {
        if (this.conversationView && !this.conversationView.isDestroyed) {
            this.conversationView.keyboardToggled(isKeyboardShown);
        }
    },

    isMobileDevice: function() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    onDestroy: function() {
        if (this._fayeSubscription) {
            this._fayeSubscription.cancel();
        }

        ViewController.prototype.onDestroy.call(this);
    }
});
