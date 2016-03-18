import sinon from 'sinon';
import { Client } from 'faye';
import { mockAppStore } from 'test/utils/redux';
import * as utilsFaye from 'utils/faye';
import * as conversationService from 'services/conversation-service';
import { SHOW_SETTINGS_NOTIFICATION } from 'actions/app-state-actions';

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
        beforeEach(() => utilsFaye.initFaye());

        describe('when conversation is started', () => {

            it('should call getconversation when transport:up event is emitted', () => {
                getConversationStub.should.have.been.calledOnce;
            });
        });
    });
});
