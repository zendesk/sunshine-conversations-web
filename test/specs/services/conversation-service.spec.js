import sinon from 'sinon';
import { getMock } from 'test/mocks/core';
import { getMockedStore } from 'test/utils/redux';
import * as coreService from 'services/core';
import * as utilsFaye from 'utils/faye';
import * as userService from 'services/user-service';
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
            conversation: {
                messages: []
            }
        });

        coreStub = sandbox.stub(coreService, 'core', () => {
            return coreMock;
        });

        fayeSubscriptionMock = {
            then: sandbox.spy((cb) => {
                return cb({
                    conversation: {
                        messages: []
                    }
                });
            }),
            cancel: sandbox.stub()
        };

        sandbox.stub(utilsFaye, 'initFaye').returns(fayeSubscriptionMock);
        sandbox.stub(userService, 'immediateUpdate').resolves();
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
                    conversation: {
                        messages: []
                    }
                });
                mockedStore.dispatch.should.have.been.calledWith({
                    type: 'SET_CONVERSATION',
                    conversation: {
                        messages: []
                    }
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
                        conversation: {
                            messages: []
                        }
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
                    payload.should.deep.eq({
                        conversation: {
                            messages: []
                        }
                    });
                });
            });
        });
    });

    describe('disconnectFaye', () => {
        beforeEach(() => {
            sandbox.stub(conversationService, 'getConversation');
            conversationService.getConversation.resolves({
                conversation: {
                    messages: []
                }
            });
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
                });
            });
        });
    });

    describe('sendMessage', () => {
        describe('conversation started and connected to faye', () => {
            beforeEach(() => {
                mockedStore = mockStore(sandbox, {
                    user: {
                        _id: '1',
                        conversationStarted: true
                    },
                    faye: {
                        subscription: fayeSubscriptionMock
                    }
                });

                coreMock.conversations.sendMessage.resolves({
                    conversation: 'conversation'
                });

                sandbox.stub(conversationService, 'connectFaye').resolves();
            });

            it('should not connect faye', () => {
                return conversationService.sendMessage('message').then(() => {
                    userService.immediateUpdate.should.have.been.calledOnce;

                    coreMock.conversations.sendMessage.should.have.been.calledWithMatch('1', {
                        text: 'message',
                        role: 'appUser'
                    });

                    utilsFaye.initFaye.should.not.have.been.called;
                });
            });
        });

        describe('conversation started and not connected to faye', () => {
            beforeEach(() => {
                mockedStore = mockStore(sandbox, {
                    user: {
                        _id: '1',
                        conversationStarted: true
                    },
                    faye: {
                        subscription: undefined
                    }
                });

                coreMock.conversations.sendMessage.resolves({
                    conversation: 'conversation'
                });
            });

            it('should connect faye', () => {
                return conversationService.sendMessage('message').then(() => {
                    userService.immediateUpdate.should.have.been.calledOnce;

                    coreMock.conversations.sendMessage.should.have.been.calledWithMatch('1', {
                        text: 'message',
                        role: 'appUser'
                    });

                    utilsFaye.initFaye.should.have.been.calledOnce;
                });
            });
        });

        describe('conversation not started', () => {
            beforeEach(() => {
                mockedStore = mockStore(sandbox, {
                    user: {
                        _id: '1',
                        conversationStarted: true
                    },
                    faye: {
                        subscription: undefined
                    }
                });

                coreMock.conversations.sendMessage.resolves({
                    conversation: 'conversation'
                });
            });

            it('should connect faye', () => {
                return conversationService.sendMessage('message').then(() => {
                    userService.immediateUpdate.should.have.been.calledOnce;

                    coreMock.conversations.sendMessage.should.have.been.calledWithMatch('1', {
                        text: 'message',
                        role: 'appUser'
                    });

                    utilsFaye.initFaye.should.have.been.calledOnce;
                });
            });
        });
    });
});
