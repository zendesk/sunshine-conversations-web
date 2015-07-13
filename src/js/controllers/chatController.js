'use strict';

var $ = require('jquery'),
    cookie = require('cookie'),
    bindAll = require('lodash.bindall'),
    _ = require('underscore'),
    ViewController = require('view-controller');

var endpoint = require('../endpoint'),
    vent = require('../vent'),
    faye = require('../faye');

var Conversation = require('../models/conversation');

var ChatView = require('../views/chatView'),
    HeaderView = require('../views/headerView'),
    ConversationView = require('../views/conversationView');

var ChatInputController = require('../controllers/chatInputController');

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

        this.listenTo(this.user, 'change:conversationStarted', this.onConversationStarted);
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

    updateUser: function() {
        return this.user.save();
    },

    sendMessage: function(text) {
        var conversationDeferred = $.Deferred(),
            messageDeferred = $.Deferred();

        if (this.conversation.isNew()) {
            this.conversation = this.collection.create(this.conversation, {
                success: conversationDeferred.resolve,
                error: conversationDeferred.reject
            });

            conversationDeferred.then(this._initFaye);
        } else {
            conversationDeferred.resolve(this.conversation);
        }

        conversationDeferred.then(function(conversation) {
            // update the user before sending the message to ensure properties are correct
            this.updateUser().then(function() {
                var message = conversation.get('messages').create({
                    authorId: endpoint.appUserId,
                    text: text
                });

                messageDeferred.resolve(message);
            });
        }.bind(this)).fail(messageDeferred.reject);

        return messageDeferred;
    },
    scrollToBottom: function() {
        if (!!this.conversationView) {
            this.conversationView.scrollToBottom();
        }
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
            faye.init(conversation.id);
        }
        return conversation;
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

    _renderWidget: function(conversation) {
        this.model = conversation;

        this.headerView = new HeaderView({
            model: conversation,
            headerText: this.uiText.headerText
        });

        this.listenTo(this.headerView, 'toggle', this.toggle);

        this.conversationView = new ConversationView({
            model: conversation,
            collection: conversation.get('messages'),
            childViewOptions: {
                conversation: conversation
            },
            introText: this.uiText.introText
        });

        this.chatInputController = new ChatInputController({
            model: conversation,
            collection: conversation.get('messages'),
            viewOptions: {
                inputPlaceholder: this.uiText.inputPlaceholder,
                sendButtonText: this.uiText.sendButtonText
            }
        });

        this.listenTo(this.chatInputController, 'message:send', this.sendMessage);
        this.listenTo(this.chatInputController, 'message:read', this.resetUnread);

        this.view.header.show(this.headerView);
        this.view.main.show(this.conversationView);
        this.view.footer.show(this.chatInputController.getView());
    },

    onConversationStarted: function(model, conversationStarted) {
        if (conversationStarted) {
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
            this.latestReadTs = parseInt(cookie.parse(document.cookie)['sk_latestts'] || 0);
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
    }
});
