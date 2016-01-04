import sinon from 'sinon';
import { getMock } from 'test/mocks/core';
import { getMockedStore } from 'test/utils/redux';
import * as coreService from 'services/core';
import * as utilsFaye from 'utils/faye';
import * as conversationService from 'services/conversation-service';

const AppStore = require('stores/app-store');

const store = AppStore.store;

function mockStore(s, state = {}) {
    var mockedStore = getMockedStore(s, state);

    Object.defineProperty(AppStore, 'store', {
        get: () => {
            return mockedStore;
        }
    });

    return mockedStore;
}

describe('Conversation service', () => {
    var sandbox;
    var coreMock;
    var coreStub;
    var mockedStore;
    var fayeSubscriptionMock;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    after(() => {
        Object.defineProperty(AppStore, 'store', {
            get: () => {
                return store;
            }
        });
    });

    beforeEach(() => {
        coreMock = getMock(sandbox);
        coreMock.conversations.get.resolves({
            conversation: 'mocked conversation payload'
        });

        coreStub = sandbox.stub(coreService, 'core', () => {
            return coreMock;
        });

        fayeSubscriptionMock = {
            then: sandbox.spy((cb) => {
                return cb('mocked subscription payload');
            }),
            cancel: sandbox.stub()
        };

        sandbox.stub(utilsFaye, 'initFaye');
        utilsFaye.initFaye.returns(fayeSubscriptionMock);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('getConversation', () => {
        beforeEach(() => {
            mockedStore = mockStore(sandbox, {
                user: {
                    _id: '1'
                }
            });
        });

        it('should call smooch-core conversation api and dispatch conversation', () => {
            return conversationService.getConversation().then((response) => {
                coreMock.conversations.get.should.have.been.calledWith('1');

                response.should.deep.eq({
                    conversation: 'mocked conversation payload'
                });
                mockedStore.dispatch.should.have.been.calledWith({
                    type: 'SET_CONVERSATION',
                    conversation: 'mocked conversation payload'
                });
            });
        });
    });

    describe('connectFaye', () => {
        describe('without subscription active', () => {
            beforeEach(() => {
                mockedStore = mockStore(sandbox, {
                    user: {
                        _id: '1'
                    },
                    faye: {
                        subscription: undefined
                    }
                });
            });

            it('should call initFaye and dispatch the result', () => {
                return conversationService.connectFaye().then((payload) => {
                    utilsFaye.initFaye.should.have.been.calledOnce;
                    mockedStore.dispatch.should.have.been.calledWith({
                        type: 'SET_FAYE_SUBSCRIPTION',
                        subscription: fayeSubscriptionMock
                    });
                    coreMock.conversations.get.should.have.been.calledOnce;
                    payload.should.deep.eq({
                        conversation: 'mocked conversation payload'
                    });
                });
            });
        });

        describe('with subscription active', () => {
            beforeEach(() => {
                mockedStore = mockStore(sandbox, {
                    faye: {
                        subscription: fayeSubscriptionMock
                    }
                });
            });

            it('should do nothing and return the subscription', () => {
                return conversationService.connectFaye().then((payload) => {
                    utilsFaye.initFaye.should.not.have.been.calledOnce;
                    coreMock.conversations.get.should.not.have.been.called;
                    mockedStore.dispatch.should.not.have.been.called;
                    payload.should.eq('mocked subscription payload');
                });
            });
        });
    });

    describe('disconnectFaye', () => {
        beforeEach(() => {
            sandbox.stub(conversationService, 'getConversation');
            conversationService.getConversation.resolves('mocked conversation payload');
        });

        describe('without subscription active', () => {
            beforeEach(() => {
                mockedStore = mockStore(sandbox, {
                    faye: {
                        subscription: undefined
                    }
                });
            });

            it('should do nothing', () => {
                conversationService.disconnectFaye();
                mockedStore.dispatch.should.not.have.been.called;
            });
        });

        describe('with subscription active', () => {
            beforeEach(() => {
                mockedStore = mockStore(sandbox, {
                    faye: {
                        subscription: fayeSubscriptionMock
                    }
                });
            });

            it('should call initFaye and dispatch the result', () => {
                conversationService.disconnectFaye();
                fayeSubscriptionMock.cancel.should.have.been.calledOnce;
                mockedStore.dispatch.should.have.been.calledWith({
                    type: 'UNSET_FAYE_SUBSCRIPTION'
                })
            });
        });
    });

    describe('sendMessage', () => {
        // TODO
    });
});
