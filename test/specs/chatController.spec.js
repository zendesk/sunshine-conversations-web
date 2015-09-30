/* global Promise:false */
var sinon = require('sinon');
var ChatController = require('../../src/js/controllers/chatController');
var Conversations = require('../../src/js/collections/conversations');
var Conversation = require('../../src/js/models/conversation');
var vent = require('../../src/js/vent');
var endpoint = require('../../src/js/endpoint');
var AppUser = require('../../src/js/models/appUser');

var ClientScenario = require('../scenarios/clientScenario');

describe('ChatController', function() {
    var scenario;
    var sandbox;
    var chatController;
    var conversations;
    var user;
    var getConversationSpy;
    var initFayeSpy;
    var initMessagingBusSpy;
    var manageUnreadSpy;
    var receiveSpy;
    var renderWidgetSpy;
    var initConversationSpy;

    before(function() {
        scenario = new ClientScenario();
        scenario.build();

        sandbox = sinon.sandbox.create();
    });

    after(function() {
        scenario.clean();
    });

    beforeEach(function(done) {
        conversations = new Conversations();
        user = new AppUser({
            givenName: 'test',
            surname: 'user',
            _id: '12345'
        });

        endpoint.appUserId = user.id;

        sandbox.stub(user, 'save', function(attributes, options) {
            return this._save(attributes, options);
        });

        chatController = new ChatController({
            collection: conversations,
            user: user
        });

        getConversationSpy = sandbox.spy(chatController, '_getConversation');
        initFayeSpy = sandbox.stub(chatController, '_initFaye', function(conversation) {
            chatController._fayeClient = {disconnect: function(){}};
            return Promise.resolve(conversation);
        });
        initMessagingBusSpy = sandbox.spy(chatController, '_initMessagingBus');
        manageUnreadSpy = sandbox.spy(chatController, '_manageUnread');
        renderWidgetSpy = sandbox.spy(chatController, '_renderWidget');
        receiveSpy = sandbox.spy(chatController, '_receiveMessage');
        initConversationSpy = sandbox.spy(chatController, '_initConversation');

        chatController.getWidget().then(function() {
            done();
        });
    });

    afterEach(function() {
        sandbox.restore();

        chatController.destroy();
        conversations.reset();

        endpoint.reset();
    });

    describe('#getWidget', function() {
        it('should trigger the init chain', function() {
            getConversationSpy.should.have.been.calledOnce;
            initFayeSpy.should.have.been.calledOnce;
            initMessagingBusSpy.should.have.been.calledOnce;
            manageUnreadSpy.should.have.been.calledOnce;
            renderWidgetSpy.should.have.been.calledOnce;
            initConversationSpy.should.have.been.calledOnce;
        });
    });

    describe('#sendMessage on existing conversation', function() {
        var message = 'Hey!';
        var messages;
        var initialLength;

        it('should add a message to the conversation', function(done) {
            messages = chatController.conversation.get('messages');
            initialLength = messages.length;

            chatController.sendMessage(message).then(function() {
                messages.length.should.equals(initialLength + 1);
                messages.last().get('text').should.equals(message);
                done();
            });
        });
    });

    describe('#sendMessage on new conversation', function() {
        var message = 'Hey!';
        var messages;
        var initialLength;

        beforeEach(function() {
            chatController.conversation = new Conversation();
        });

        it('should add a message to the conversation', function(done) {
            messages = chatController.conversation.get('messages');
            initialLength = messages.length;

            chatController.sendMessage(message).then(function() {
                messages.length.should.equals(initialLength + 1);
                messages.last().get('text').should.equals(message);
                done();
            });
        });
    });

    describe('#_receiveMessage', function() {
        it('should add a message to the conversation', function() {

            var message = {
                authorId: 1,
                text: 'Hey!'
            };

            var messages = chatController.conversation.get('messages');
            var initialLength = messages.length;
            chatController._receiveMessage(message);
            messages.length.should.equals(initialLength + 1);
            messages.last().get('text').should.equals(message.text);
        });

    });

    describe('vent', function() {
        var message = {
            authorId: 1,
            text: 'Hey!'
        };

        it('should trigger _receiveMessage', function() {
            vent.trigger('receive:message', message);
            receiveSpy.should.have.been.calledOnce;
            receiveSpy.should.have.been.calledWith(message);
        });
    });

});
