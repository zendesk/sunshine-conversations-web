var sinon = require('sinon'),
    _ = require('underscore'),
    $ = require('jquery'),
    ChatController = require('../../src/js/controllers/chatController'),
    Conversations = require('../../src/js/collections/conversations'),
    vent = require('../../src/js/vent');

var ClientScenario = require('../scenarios/clientScenario');

describe('ChatController', function() {
    var scenario,
        SupportKit,
        sandbox,
        chatController,
        conversations;

    before(function() {
        scenario = new ClientScenario();
        scenario.build();

        sandbox = sinon.sandbox.create();

        conversations = new Conversations();

        chatController = new ChatController({
            collection: conversations
        });
    });

    after(function() {
        sandbox.restore();
        scenario.clean();

        chatController.destroy();
        conversations.reset();
    });


    describe('onRender', function() {
        var getConversationSpy,
            initFayeSpy,
            initMessagingBusSpy,
            manageUnreadSpy,
            renderWidgetSpy,
            renderedSpy;


        beforeEach(function() {
            getConversationSpy = sandbox.spy(chatController._getConversation);
            initFayeSpy = sandbox.spy(chatController._initFaye);
            initMessagingBusSpy = sandbox.spy(chatController._initMessagingBus);
            manageUnreadSpy = sandbox.spy(chatController._manageUnread);
            renderWidgetSpy = sandbox.spy(chatController._renderWidget);
            chatController.once('rendered', renderedSpy);
        });

        afterEach(function() {
            sandbox.restore();
        });


        it('should trigger the init chain', function(done) {
            var view = chatController.getView();

            chatController.once('rendered', function() {
                done();
            });


            $('body').append(view.render().el);

            getConversationSpy.should.have.been.calledOnce;
            initFayeSpy.should.have.been.calledOnce;
            initMessagingBusSpy.should.have.been.calledOnce;
            manageUnreadSpy.should.have.been.calledOnce;
            renderWidgetSpy.should.have.been.calledOnce;
            renderedSpy.should.have.been.calledOnce;
        });
    });


});
