import sinon from 'sinon';
import { Client } from 'faye';

import { createMockedStore, generateBaseStoreProps } from '../../utils/redux';
import { hideChannelPage, hideConnectNotification } from '../../../src/frame/js/actions/app-state';
import { setUser } from '../../../src/frame/js/actions/user';
import { addMessage, incrementUnreadCount } from '../../../src/frame/js/actions/conversation';
import * as fayeActions from '../../../src/frame/js/actions/faye';
import { __Rewire__ as FayeRewire, __RewireAPI__ as FayeRewireAPI } from '../../../src/frame/js/actions/faye';

const handleMessageEvents = FayeRewireAPI.__get__('handleMessageEvents');
const getClient = FayeRewireAPI.__get__('getClient');
const sandbox = sinon.sandbox.create();

describe('Faye Actions', () => {
    let mockedStore;
    let getMessagesStub;
    let disconnectFayeStub;
    let showSettingsStub;
    let hideChannelPageSpy;
    let hideConnectNotificationSpy;
    let addMessageSpy;
    let incrementUnreadCountSpy;
    let resetUnreadCountStub;
    let setUserSpy;
    let setFayeSubscriptionSpy;

    beforeEach(() => {
        mockedStore = createMockedStore(sandbox, generateBaseStoreProps());

        sandbox.stub(Client.prototype, 'addExtension');

        getMessagesStub = sandbox.stub().returnsAsyncThunk();
        FayeRewire('getMessages', getMessagesStub);

        disconnectFayeStub = sandbox.stub().returnsAsyncThunk();
        FayeRewire('disconnectFaye', disconnectFayeStub);

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

        resetUnreadCountStub = sandbox.stub().returnsAsyncThunk();
        FayeRewire('resetUnreadCount', resetUnreadCountStub);

        setUserSpy = sandbox.spy(setUser);
        FayeRewire('setUser', setUserSpy);

        setFayeSubscriptionSpy = sandbox.spy(fayeActions.setFayeSubscription);
        FayeRewire('setFayeSubscription', setFayeSubscriptionSpy);

        FayeRewire('getClientId', sandbox.stub().returns(123));
    });

    afterEach(() => {
        mockedStore.dispatch(fayeActions.disconnectClient());
        sandbox.restore();
    });

    describe('getClient', () => {
        beforeEach(() => {
            sandbox.stub(Client.prototype, 'subscribe').callsFake(function() {
                this._events['transport:up']();
                return Promise.resolve();
            });
        });
        describe('when conversation is started', () => {
            beforeEach(() => {
                mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                    user: {
                        conversationStarted: true
                    }
                }));
            });

            it('should call getMessages when transport:up event is emitted', () => {
                const client = mockedStore.dispatch(getClient());
                client.subscribe();
                getMessagesStub.should.have.been.calledOnce;
            });
        });

        describe('when conversation is not started', () => {
            beforeEach(() => {
                mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                    user: {
                        conversationStarted: false
                    }
                }));
            });

            it('should not call getMessages when transport:up event is emitted', () => {
                const client = mockedStore.dispatch(getClient());
                return client.subscribe().then(() => {
                    getMessagesStub.should.not.have.been.called;
                });
            });
        });
    });

    describe('handleMessageEvents', () => {
        beforeEach(() => {
            mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                conversation: {
                    _id: 'some-conversation-id'
                }
            }));
        });

        function generateEvent({conversationId='some-conversation-id', message} = {}) {
            return {
                conversation: {
                    _id: conversationId
                },
                message
            };
        }

        describe('message from different device', () => {
            it('should add the message', () => {
                const message = {
                    source: {
                        id: 1
                    }
                };
                mockedStore.dispatch(handleMessageEvents([generateEvent({
                    message
                })]));

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
                        mockedStore.dispatch(handleMessageEvents([generateEvent({
                            message
                        })]));
                        appUser ? resetUnreadCountStub.should.have.been.calledOnce : resetUnreadCountStub.should.not.have.been.called;
                    });
                });
            });
        });

        describe('message from same device', () => {
            it('should not add the message', () => {
                const message = {
                    source: {
                        id: 123
                    }
                };

                mockedStore.dispatch(handleMessageEvents([generateEvent({
                    message
                })]));

                addMessageSpy.should.not.have.been.called;
            });
        });

        describe('message from different conversation', () => {
            it('should not add the message', () => {
                const message = {
                    source: {
                        id: 1
                    }
                };

                mockedStore.dispatch(handleMessageEvents([generateEvent({
                    message,
                    conversationId: 'some-other-conversation-id'
                })]));

                addMessageSpy.should.not.have.been.called;
            });
        });


        [true, false].forEach((appUser) => {
            describe(`message ${appUser ? '' : 'not'} from appUser`, () => {
                it(`should ${appUser ? 'not' : ''} increment unread count`, () => {
                    const message = {
                        source: {
                            id: 1
                        },
                        role: appUser ? 'appUser' : 'appMaker'
                    };
                    mockedStore.dispatch(handleMessageEvents([generateEvent({
                        message
                    })]));
                    appUser ? incrementUnreadCountSpy.should.not.have.been.called : incrementUnreadCountSpy.should.have.been.calledOnce;
                });
            });
        });
    });

    describe('subscribe', () => {
        it('should call setFayeSubcription', () => {
            mockedStore = createMockedStore(sandbox, generateBaseStoreProps());
            mockedStore.dispatch(fayeActions.subscribe()).then(() => {
                setFayeSubscriptionSpy.should.have.been.calledOnce;
            });
        });
    });

    describe.skip('updateUser', () => {
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
                mockedStore.dispatch(fayeActions.updateUser(currentAppUser, nextAppUser));
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
                    mockedStore.dispatch(fayeActions.updateUser(currentAppUser, nextAppUser));
                    getMessagesStub.should.have.been.calledOnce;
                });
            });
            describe.skip('next appUser started conversation', () => {
                // TODO : figure out if still relevant
                it('should connect faye and fetch conversation', () => {
                    nextAppUser.conversationStarted = true;
                    mockedStore.dispatch(fayeActions.updateUser(currentAppUser, nextAppUser));
                });
            });
        });
    });

    describe.skip('handleUserSubscription', () => {
        beforeEach(() => {
            mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
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

                        mockedStore.dispatch(fayeActions.handleUserSubscription(req));
                        hideConnectNotificationSpy.should.have.been.calledOnce;
                        platform ? showSettingsStub.should.have.been.calledOnce : showSettingsStub.should.not.have.been.called;
                    });
                });
            });
        });
    });

    describe('disconnectClient', () => {
        it('should disconnect', () => {
            sandbox.stub(Client.prototype, 'disconnect');
            mockedStore.dispatch(getClient());
            mockedStore.dispatch(fayeActions.disconnectClient());
            Client.prototype.disconnect.should.have.been.calledOnce;
        });
    });
});
