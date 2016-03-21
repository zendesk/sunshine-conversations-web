import sinon from 'sinon';
import { Client } from 'faye';
import { mockAppStore } from 'test/utils/redux';
import * as utilsFaye from 'utils/faye';
import * as conversationService from 'services/conversation-service';

const state = {
    user: {
        conversationStarted: true
    },
    faye: {
        subscription: false
    },
    appState: {
        serverUrl: 'http://localhost'
    },
    conversation: {
        messages: []
    }
};

describe('faye', () => {
    let sandbox;
    let getConversationStub;
    let mockedStore;

    after(() => {
        mockedStore && mockedStore.restore();
    });

    before(() => {
        sandbox = sinon.sandbox.create();
        mockedStore = mockAppStore(sandbox, state);
    });

    beforeEach(() => {
        sandbox.stub(Client.prototype, 'addExtension');
        sandbox.stub(Client.prototype, 'subscribe', function() {
            this._events['transport:up']();
        });

        getConversationStub = sandbox.stub(conversationService, 'getConversation');
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('when connected', () => {
        describe('when conversation is started', () => {
            it('should call getconversation when transport:up event is emitted', () => {
                utilsFaye.initFaye();
                getConversationStub.should.have.been.calledOnce;
            });
        });

        describe('when conversation is not started', () => {
            beforeEach(() => {
                mockedStore = mockAppStore(sandbox, Object.assign(state, {
                    user: {
                        conversationStarted: false
                    }
                }));
            });

            it('should not call getconversation when transport:up event is emitted', () => {
                utilsFaye.initFaye();
                getConversationStub.should.not.have.been.called;
            });
        });
    });
});
