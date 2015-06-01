var sinon = require('sinon'),
    _ = require('underscore'),
    ChatController = require('../../src/js/controllers/chatController'),
    Conversations = require('../../src/js/collections/conversations'),
    vent = require('../../src/js/vent');

var ClientScenario = require('../scenarios/clientScenario');
describe('Main', function() {
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
            renderWidgetSpy;


        beforeEach(function() {
            getConversationSpy = sandbox.spy(chatController._getConversation);
            initFayeSpy = sandbox.spy(chatController._initFaye);
            initMessagingBusSpy = sandbox.spy(chatController._initMessagingBus);
            manageUnreadSpy = sandbox.spy(chatController._manageUnread);
            renderWidgetSpy = sandbox.spy(chatController._renderWidget);
        });

        afterEach(function(){
            sandbox.restore();
        });


        it('should trigger the init chain', function() {
            var view = chatController.getView();
            view.render();


            getConversationSpy.should.be.calledOnce;

        });
    });


});
