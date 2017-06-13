import sinon from 'sinon';
import { Client } from 'faye';

import { createMockedStore } from '../../utils/redux';
import { hideChannelPage, hideConnectNotification } from '../../../src/frame/js/actions/app-state-actions';
import { addMessage, incrementUnreadCount, resetUnreadCount } from '../../../src/frame/js/actions/conversation-actions';
import { setFayeUserSubscription, setFayeConversationSubscription } from '../../../src/frame/js/actions/faye-actions';
import { setUser } from '../../../src/frame/js/actions/user-actions';
import * as fayeService from '../../../src/frame/js/services/faye';
import { __Rewire__ as FayeRewire } from '../../../src/frame/js/services/faye';

function getProps(props = {}) {
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
    return Object.assign({}, state, props);
}

const sandbox = sinon.sandbox.create();

describe('Faye service', () => {
    let mockedStore;
    let getMessagesStub;
    let disconnectFayeStub;
    let handleConversationUpdatedStub;
    let showSettingsStub;
    let hideChannelPageSpy;
    let hideConnectNotificationSpy;
    let addMessageSpy;
    let incrementUnreadCountSpy;
    let resetUnreadCountSpy;
    let setUserSpy;
    let setFayeConversationSubscriptionSpy;
    let setFayeUserSubscriptionSpy;

    beforeEach(() => {
        mockedStore = createMockedStore(sandbox, getProps());

        sandbox.stub(Client.prototype, 'addExtension');

        getMessagesStub = sandbox.stub().returnsAsyncThunk();
        FayeRewire('getMessages', getMessagesStub);

        disconnectFayeStub = sandbox.stub().returnsAsyncThunk();
        FayeRewire('disconnectFaye', disconnectFayeStub);

        handleConversationUpdatedStub = sandbox.stub().returnsAsyncThunk();
        FayeRewire('handleConversationUpdated', handleConversationUpdatedStub);

        showSettingsStub = sandbox.stub().returnsAsyncThunk();
        FayeRewire('showSettings', showSettingsStub);

        hideChannelPageSpy = sandbox.spy(hideChannelPage);
        FayeRewire('hideChannelPage', hideChannelPageSpy);

        hideConnectNotificationSpy = sandbox.spy(hideConnectNotification);
        FayeRewire('hideConnectNotification', hideConnectNotificationSpy);

        addMessageSpy = sandbox.spy(addMessage);
        FayeRewire('addMessage', addMessageSpy);

        incrementUnreadCountSpy = sandbox.spy(incrementUnreadCount);
        FayeRewire('incrementUnreadCount', incrementUnreadCountSpy);

        resetUnreadCountSpy = sandbox.spy(resetUnreadCount);
        FayeRewire('resetUnreadCount', resetUnreadCountSpy);

        setUserSpy = sandbox.spy(setUser);
        FayeRewire('setUser', setUserSpy);

        setFayeConversationSubscriptionSpy = sandbox.spy(setFayeConversationSubscription);
        FayeRewire('setFayeConversationSubscription', setFayeConversationSubscriptionSpy);

        setFayeUserSubscriptionSpy = sandbox.spy(setFayeUserSubscription);
        FayeRewire('setFayeUserSubscription', setFayeUserSubscriptionSpy);

        FayeRewire('getDeviceId', sandbox.stub().returns(123));
    });

    afterEach(() => {
        fayeService.disconnectClient();
        sandbox.restore();
    });

    describe('getClient', () => {
        beforeEach(() => {
            sandbox.stub(Client.prototype, 'subscribe', function() {
                this._events['transport:up']();
            });
        });
        describe('when conversation is started', () => {
            it('should call getMessages when transport:up event is emitted', () => {
                const client = mockedStore.dispatch(fayeService.getClient());
                client.subscribe();
                getMessagesStub.should.have.been.calledOnce;
            });
        });

        describe('when conversation is not started', () => {
            beforeEach(() => {
                mockedStore = createMockedStore(sandbox, getProps({
                    user: {
                        conversationStarted: false
                    }
                }));
            });

            it('should not call getMessages when transport:up event is emitted', () => {
                const client = mockedStore.dispatch(fayeService.getClient());
                client.subscribe();
                getMessagesStub.should.not.have.been.called;
            });
        });
    });

    describe('handleConversationSubscription', () => {
        describe('message from different device', () => {
            it('should add the message', () => {
                const message = {
                    source: {
                        id: 1
                    }
                };
                mockedStore.dispatch(fayeService.handleConversationSubscription(message));
                addMessageSpy.should.have.been.calledWithMatch(message);
            });

            [true, false].forEach((appUser) => {
                describe(`message ${appUser ? '' : 'not'} from appUser`, () => {
                    it(`should ${appUser ? '' : 'not'} reset unread count`, () => {
                        const message = {
                            source: {
                                id: 1
                            },
                            role: appUser ? 'appUser' : 'appMaker'
                        };
                        mockedStore.dispatch(fayeService.handleConversationSubscription(message));
                        appUser ? resetUnreadCountSpy.should.have.been.calledOnce : resetUnreadCountSpy.should.not.have.been.called;
                    });
                });
            });
        });

        [true, false].forEach((appUser) => {
            describe(`message ${appUser ? '' : 'not'} from appUser`, () => {
                it(`should ${appUser ? 'not' : ''} increment unread count`, () => {
                    const message = {
                        source: {
                            id: 123
                        },
                        role: appUser ? 'appUser' : 'appMaker'
                    };
                    mockedStore.dispatch(fayeService.handleConversationSubscription(message));
                    appUser ? incrementUnreadCountSpy.should.not.have.been.called : incrementUnreadCountSpy.should.have.been.calledOnce;
                });
            });
        });
    });

    describe('subscribeConversation', () => {
        it('should call setFayeConversationSubcription', () => {
            mockedStore = createMockedStore(sandbox, getProps({
                conversation: {
                    _id: 123
                }
            }));
            mockedStore.dispatch(fayeService.subscribeConversation()).then(() => {
                setFayeConversationSubscriptionSpy.should.have.been.calledOnce;
            });
        });
    });

    describe('updateUser', () => {
        let currentAppUser;
        let nextAppUser;
        describe('different appUser', () => {
            beforeEach(() => {
                currentAppUser = {
                    _id: 1
                };
                nextAppUser = {
                    _id: 2
                };
            });

            it('should subscribe new user', () => {
                mockedStore.dispatch(fayeService.updateUser(currentAppUser, nextAppUser));
                hideChannelPageSpy.should.have.been.calledOnce;
                disconnectFayeStub.should.have.been.calledOnce;
                setUserSpy.should.have.been.calledWithMatch(nextAppUser);
            });
        });

        describe('same appUser', () => {
            beforeEach(() => {
                currentAppUser = {
                    _id: 1
                };
                nextAppUser = {
                    _id: 1
                };
            });
            describe('current appUser started conversation', () => {
                it('should fetch conversation', () => {
                    currentAppUser.conversationStarted = true;
                    mockedStore.dispatch(fayeService.updateUser(currentAppUser, nextAppUser));
                    getMessagesStub.should.have.been.calledOnce;
                });
            });
            describe('next appUser started conversation', () => {
                it('should connect faye and fetch covnersation', () => {
                    nextAppUser.conversationStarted = true;
                    mockedStore.dispatch(fayeService.updateUser(currentAppUser, nextAppUser));
                    handleConversationUpdatedStub.should.have.been.calledOnce;
                });
            });
        });
    });

    describe('handleUserSubscription', () => {
        beforeEach(() => {
            mockedStore = createMockedStore(sandbox, getProps({
                user: {
                    _id: 1
                },
                appState: {
                    visibleChannelType: 'web'
                }
            }));
        });
        describe('link event', () => {
            const event = {
                type: 'link',
                clientId: 123
            };
            [true, false].forEach((platform) => {
                describe(`platform is ${platform ? '' : 'not'} the same as visibleChannelType`, () => {
                    it(`should ${platform ? '' : 'not'} show the settings page`, () => {
                        const appUser = {
                            _id: 1,
                            clients: [
                                {
                                    id: 123,
                                    platform: platform ? 'web' : 'messenger'
                                }
                            ]
                        };
                        const req = {
                            appUser: appUser,
                            event: event
                        };

                        mockedStore.dispatch(fayeService.handleUserSubscription(req));
                        hideConnectNotificationSpy.should.have.been.calledOnce;
                        platform ? showSettingsStub.should.have.been.calledOnce : showSettingsStub.should.not.have.been.called;
                    });
                });
            });
        });
    });

    describe('subscribeUser', () => {
        it('should call setFayeUserSubscription', () => {
            mockedStore = createMockedStore(sandbox, getProps());
            mockedStore.dispatch(fayeService.subscribeUser()).then(() => {
                setFayeUserSubscriptionSpy.should.have.been.calledOnce;
            });
        });
    });

    describe('disconnectClient', () => {
        it('should disconnect', () => {
            sandbox.stub(Client.prototype, 'disconnect');
            mockedStore.dispatch(fayeService.getClient());
            fayeService.disconnectClient();
            Client.prototype.disconnect.should.have.been.calledOnce;
        });
    });
});
