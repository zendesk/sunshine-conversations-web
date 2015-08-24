'use strict';

var $ = require('jquery');
var cookie = require('cookie');
var bindAll = require('lodash.bindall');
var _ = require('underscore');
var ViewController = require('view-controller');

var endpoint = require('../endpoint');
var vent = require('../vent');
var faye = require('../faye');

var Conversation = require('../models/conversation');

var ChatView = require('../views/chatView');
var HeaderView = require('../views/headerView');
var ConversationView = require('../views/conversationView');
var SettingsHeaderView = require('../views/settingsHeaderView');
var EmailNotificationView = require('../views/emailNotificationView');

var ChatInputController = require('../controllers/chatInputController');
var SettingsController = require('../controllers/settingsController');

module.exports = ViewController.extend({
    viewClass: ChatView,

    viewEvents: {
        focus: 'resetUnread'
    },

    initialize: function() {
        bindAll(this);
        this.isOpened = false;
        this.user = this.getOption('user');
        this.uiText = this.getOption('uiText') || {};
        this.conversationInitiated = false;
    },

    open: function() {
        if (!!this.view && !!this.chatInputController && !this.isOpened) {
            this.isOpened = true;
            this.view.open();
            this.chatInputController.focus();
            this.conversationView.positionLogo();
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
        return $.Deferred().resolve().then(function() {
            var promise = $.Deferred();

            if (this.conversation.isNew()) {
                this.conversation = this.collection.create(this.conversation, {
                    success: promise.resolve,
                    error: promise.reject
                });
            } else {
                promise.resolve(this.conversation);
            }

            return promise;
        }.bind(this))
            .then(this._initFaye)
            .then(function(conversation) {
                // update the user before sending the message to ensure properties are correct
                return this.user._save({}, {
                    wait: true
                }).then(_.constant(conversation));
            }.bind(this)).then(function(conversation) {
            var promise = $.Deferred();

            conversation.get('messages').create({
                authorId: endpoint.appUserId,
                text: text
            }, {
                success: promise.resolve,
                error: promise.reject
            });

            return promise;
        }.bind(this)).then(function(message) {
            var appUserMessages = this.conversation.get('messages').filter(function(message) {
                return message.get('authorId') === endpoint.appUserId;
            });

            if (this.getOption('emailCaptureEnabled') &&
                appUserMessages.length === 1 &&
                !this.user.get('email')) {
                this._showEmailNotification();
            }

            return message;
        }.bind(this));
    },

    scrollToBottom: function() {
        if (!!this.conversationView) {
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
        if (!!this.conversation) {

            // we actually need to extract the appMakers first
            // since the message rendering is done on message add event
            // and some UI stuff is relying on the appMakers collection
            if (!this.conversation.get('appMakers').get(message.authorId)) {
                this.conversation.get('appMakers').add({
                    id: message.authorId
                });
            }

            this.conversation.get('messages').add(message);
        }
    },

    _getConversation: function() {
        var deferred = $.Deferred();

        if (this.conversation) {
            // we created an empty collection, but a remote one was created
            // we need to swap them without unbinding everything
            if (this.conversation.isNew() && this.collection.length > 0) {
                var remoteConversation = this.collection.at(0);
                this.conversation.set(remoteConversation.toJSON());
                this.collection.shift();
                this.collection.unshift(this.conversation);
            }
        } else {
            if (this.collection.length > 0) {
                this.conversation = this.collection.at(0);
            } else {
                this.conversation = new Conversation({
                    appUserId: endpoint.appUserId
                });
            }
        }

        deferred.resolve(this.conversation);

        return deferred;
    },

    _initFaye: function(conversation) {
        if (!conversation.isNew()) {
            return faye.init(conversation.id).then(function(client) {
                this._fayeClient = client;
                return conversation;
            }.bind(this));
        }

        return $.Deferred().resolve(conversation);
    },

    _initConversation: function() {
        var promise;

        if (this.conversationInitiated) {
            promise = this._getConversation();
        } else {
            promise = this.collection.fetch()
                .then(this._getConversation)
                .then(this._initFaye)
                .then(_.bind(function(conversation) {
                    this.conversationInitiated = !conversation.isNew();

                    // let's listen on the user attribute change instead
                    if (!this.conversationInitiated) {
                        this.listenTo(this.user, 'change:conversationStarted', this.onConversationStarted);
                    }

                    return conversation;
                }, this));
        }

        return promise;
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
            model: this.model,
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
            model: this.user,
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
            model: this.model,
            collection: this.model.get('messages'),
            childViewOptions: {
                conversation: this.model
            },
            introText: this.uiText.introText
        });

        this.getView().main.show(this.conversationView);
    },

    _renderConversationInput: function() {
        this.chatInputController = new ChatInputController({
            model: this.model,
            collection: this.model.get('messages'),
            viewOptions: {
                inputPlaceholder: this.uiText.inputPlaceholder,
                sendButtonText: this.uiText.sendButtonText
            }
        });

        this.listenTo(this.chatInputController, 'message:send', this.sendMessage);
        this.listenTo(this.chatInputController, 'message:read', this.resetUnread);
        this.getView().footer.show(this.chatInputController.getView());
    },

    _renderWidget: function(conversation) {
        this.model = conversation;

        this._renderChatHeader();
        this._renderConversation();
        this._renderConversationInput();
    },

    onConversationStarted: function(model, conversationStarted) {
        if (conversationStarted) {
            this.stopListening(this.user, 'change:conversationStarted', this.onConversationStarted);
            this._initConversation();
        }
    },

    getWidget: function() {
        var view = this.getView();

        if (view.isRendered) {
            return $.Deferred().resolve(view);
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

    _getLatestReadTime: function() {
        if (!this.latestReadTs) {
            this.latestReadTs = parseInt(cookie.parse(document.cookie).sk_latestts || 0);
        }
        return this.latestReadTs;
    },

    _setLatestReadTime: function(ts) {
        this.latestReadTs = ts;
        document.cookie = 'sk_latestts=' + ts;
    },

    _updateUnread: function() {
        var latestReadTs = this._getLatestReadTime();
        var unreadMessages = this.conversation.get('messages').chain()
            .filter(function(message) {
                // Filter out own messages
                return !this.conversation.get('appUsers').get(message.get('authorId'));
            }.bind(this))
            .filter(function(message) {
                return Math.floor(message.get('received')) > latestReadTs;
            })
            .value();

        if (this.unread !== unreadMessages.length) {
            this.conversation.set('unread', unreadMessages.length);
        }
    },

    resetUnread: function() {
        var latestReadTs = 0;
        var latestMessage = this.conversation.get('messages').max(function(message) {
            return message.get('received');
        });

        if (latestMessage !== -Infinity) {
            latestReadTs = Math.floor(latestMessage.get('received'));
        }
        this._setLatestReadTime(latestReadTs);
        this._updateUnread();
    },

    onDestroy: function() {
        if (this._fayeClient) {
            this._fayeClient.disconnect();
        }

        ViewController.prototype.onDestroy.call(this);
    }
});
