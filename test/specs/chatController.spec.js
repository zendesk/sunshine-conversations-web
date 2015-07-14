var sinon = require('sinon'),
    ChatController = require('../../src/js/controllers/chatController'),
    Conversations = require('../../src/js/collections/conversations'),
    vent = require('../../src/js/vent'),
    $ = require('jquery'),
    AppUser = require('../../src/js/models/appUser');

var ClientScenario = require('../scenarios/clientScenario');

describe('ChatController', function() {
    var scenario,
        sandbox,
        chatController,
        conversations,
        user,
        getConversationSpy,
        initFayeSpy,
        initMessagingBusSpy,
        manageUnreadSpy,
        receiveSpy,
        saveUserStub,
        renderWidgetSpy;

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
            surname: 'user'
        });

        chatController = new ChatController({
            collection: conversations,
            user: user
        });

        getConversationSpy = sandbox.spy(chatController, '_getConversation');
        initFayeSpy = sandbox.spy(chatController, '_initFaye');
        initMessagingBusSpy = sandbox.spy(chatController, '_initMessagingBus');
        manageUnreadSpy = sandbox.spy(chatController, '_manageUnread');
        renderWidgetSpy = sandbox.spy(chatController, '_renderWidget');
        receiveSpy = sandbox.spy(chatController, '_receiveMessage');

        sandbox.stub(user, 'isDirty', function() {
            return false;
        });

        chatController.getWidget().then(function() {
            done();
        });
    });

    afterEach(function() {
        sandbox.restore();

        chatController.destroy();
        conversations.reset();
    });

    describe('#getWidget', function() {
        it('should trigger the init chain', function() {
            getConversationSpy.should.have.been.calledOnce;
            initFayeSpy.should.have.been.calledOnce;
            initMessagingBusSpy.should.have.been.calledOnce;
            manageUnreadSpy.should.have.been.calledOnce;
            renderWidgetSpy.should.have.been.calledOnce;
        });
    });

    describe('#sendMessage', function() {
        var message = 'Hey!';
        var messages;
        var initialLength;

        beforeEach(function(done) {
            chatController.getWidget().then(function() {
                done();
            });
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

        describe('if user is dirty', function() {
            beforeEach(function() {
                sandbox.restore(user, 'isDirty');

                sandbox.stub(user, 'isDirty', function() {
                    return true;
                });

                saveUserStub = sandbox.stub(user, 'save', function() {
                    return $.Deferred().resolve(user);
                });
            });

            it('should save the user before sending the message', function(done) {
                messages = chatController.conversation.get('messages');
                initialLength = messages.length;

                chatController.sendMessage(message).then(function() {
                    saveUserStub.should.have.been.calledOnce;
                    messages.length.should.equals(initialLength + 1);
                    messages.last().get('text').should.equals(message);
                    done();
                });
            });
        });
    });


    describe('#_receiveMessage', function() {
        beforeEach(function(done) {
            chatController.getWidget().then(function() {
                done();
            });
        });

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
