import sinon from 'sinon';
import { Client } from 'faye';
import hat from 'hat';

import { createMockedStore, generateBaseStoreProps } from '../../utils/redux';
import { hideChannelPage, hideConnectNotification, hideTypingIndicator } from '../../../src/frame/js/actions/app-state';
import { setUser } from '../../../src/frame/js/actions/user';
import { addMessage, incrementUnreadCount } from '../../../src/frame/js/actions/conversation';
import * as fayeActions from '../../../src/frame/js/actions/faye';
import { __Rewire__ as FayeRewire, __RewireAPI__ as FayeRewireAPI } from '../../../src/frame/js/actions/faye';
import { login, setAuth } from '../../../src/frame/js/actions/auth';
import { setItem } from '../../../src/frame/js/utils/storage';

const handleMessageEvents = FayeRewireAPI.__get__('handleMessageEvents');
const handleActivityEvents = FayeRewireAPI.__get__('handleActivityEvents');
const handleLinkEvents = FayeRewireAPI.__get__('handleLinkEvents');
const updateUser = FayeRewireAPI.__get__('updateUser');

const getClient = FayeRewireAPI.__get__('getClient');
const sandbox = sinon.sandbox.create();

describe('Faye Actions', () => {
    let mockedStore;
    let getMessagesStub;
    let disconnectFayeStub;
    let showSettingsStub;
    let showTypingIndicatorStub;
    let hideTypingIndicatorSpy;
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

        showTypingIndicatorStub = sandbox.stub().returnsSyncThunk();
        FayeRewire('showTypingIndicator', showTypingIndicatorStub);

        hideTypingIndicatorSpy = sandbox.spy(hideTypingIndicator);
        FayeRewire('hideTypingIndicator', hideTypingIndicatorSpy);

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

    describe('handleActivityEvents', () => {
        beforeEach(() => {
            mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                conversation: {
                    _id: 'some-conversation-id'
                }
            }));
        });

        function generateEvent({conversationId='some-conversation-id', activity} = {}) {
            return {
                conversation: {
                    _id: conversationId
                },
                activity
            };
        }

        describe('message from same conversation', () => {
            it('should call the spy', () => {
                [{
                    type: 'typing:start',
                    spy: showTypingIndicatorStub
                }, {
                    type: 'typing:stop',
                    spy: hideTypingIndicatorSpy
                }].forEach(({type, spy}) => {
                    const activity = {
                        type,
                        role: 'appMaker'
                    };
                    mockedStore.dispatch(handleActivityEvents([generateEvent({
                        activity
                    })]));

                    spy.should.have.been.calledOnce;
                });
            });
        });

        describe('message from appUser', () => {
            it('should do nothing', () => {
                ['typing:start', 'typing:stop'].forEach((type) => {
                    const activity = {
                        type,
                        role: 'appUser'
                    };
                    mockedStore.dispatch(handleActivityEvents([generateEvent({
                        activity
                    })]));

                    showTypingIndicatorStub.should.not.have.been.called;
                    hideTypingIndicatorSpy.should.not.have.been.called;
                });
            });
        });

        describe('message from different conversation', () => {
            it('should not add the message', () => {
                const activity = {
                    type: 'typing:start'
                };

                mockedStore.dispatch(handleActivityEvents([generateEvent({
                    activity,
                    conversationId: 'some-other-conversation-id'
                })]));

                showTypingIndicatorStub.should.not.have.been.called;
                hideTypingIndicatorSpy.should.not.have.been.called;
            });
        });
    });

    describe('handleLinkEvents', () => {
        function generateEvent({type='link', appUserId='some-user-id', clientId='some-client-id', platform= 'messenger'} = {}) {
            return {
                type,
                appUser: {
                    _id: appUserId
                },
                client: {
                    id: clientId,
                    platform
                }
            };
        }

        beforeEach(() => {
            mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                user: {
                    _id: 'some-user-id'
                },
                appState: {
                    visibleChannelType: 'messenger'
                }
            }));
        });
        describe('link event', () => {
            [true, false].forEach((isSamePlatform) => {
                describe(`platform is ${isSamePlatform ? '' : 'not'} the same as visibleChannelType`, () => {
                    it(`should ${isSamePlatform ? '' : 'not'} show the settings page`, () => {
                        const events = [generateEvent({
                            platform: isSamePlatform ? 'messenger' : 'web'
                        })];

                        mockedStore.dispatch(handleLinkEvents(events));
                        hideConnectNotificationSpy.should.have.been.calledOnce;
                        isSamePlatform ? showSettingsStub.should.have.been.calledOnce : showSettingsStub.should.not.have.been.called;
                    });
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

    describe('updateUser', () => {
        let currentAppUser;
        let nextAppUser;
        let client;

        describe('different appUser', () => {
            let setItemSpy;
            let loginStub;
            let setAuthStub;
            let fetchUserConversationStub;

            beforeEach(() => {
                currentAppUser = {
                    _id: 1,
                    clients: []
                };
                nextAppUser = {
                    _id: 2
                };
                client = {
                    id: 'some-client_id'
                };

                setItemSpy = sandbox.spy(setItem);
                FayeRewire('setItem', setItemSpy);

                loginStub = sandbox.stub().returnsAsyncThunk();
                FayeRewire('login', loginStub);

                setAuthStub = sandbox.stub().returnsAsyncThunk();
                FayeRewire('setAuth', setAuthStub);

                fetchUserConversationStub = sandbox.stub().returnsAsyncThunk();
                FayeRewire('fetchUserConversation', fetchUserConversationStub);
            });

            it('should fetch the new user and conversation if JWT was not used', () => {
                nextAppUser.sessionToken = hat();

                mockedStore.dispatch(updateUser(currentAppUser, nextAppUser, client));

                loginStub.should.not.have.been.called;

                setUserSpy.should.have.been.calledWith({
                    ...currentAppUser,
                    _id: nextAppUser._id
                });

                const appId = mockedStore.getState().config.appId;
                setItemSpy.should.have.been.calledTwice;
                setItemSpy.should.have.been.calledWith(`${appId}.appUserId`, nextAppUser._id);
                setItemSpy.should.have.been.calledWith(`${appId}.sessionToken`, nextAppUser.sessionToken);

                setAuthStub.should.have.been.calledOnce;
                setAuthStub.should.have.been.calledWith({
                    sessionToken: nextAppUser.sessionToken
                });

                fetchUserConversationStub.should.have.been.calledOnce;
            });

            it('should login if JWT was used', () => {
                nextAppUser.userId = hat();

                mockedStore.dispatch(updateUser(currentAppUser, nextAppUser, client));

                fetchUserConversationStub.should.not.have.been.called;

                setUserSpy.should.have.been.calledWith({
                    ...currentAppUser,
                    _id: nextAppUser._id
                });

                const appId = mockedStore.getState().config.appId;
                setItemSpy.should.have.been.calledOnce;
                setItemSpy.should.have.been.calledWith(`${appId}.appUserId`, nextAppUser._id);

                setAuthStub.should.not.have.been.called;

                loginStub.should.have.been.calledOnce;
            });
        });

        describe('same appUser', () => {
            beforeEach(() => {
                currentAppUser = {
                    _id: 1,
                    clients: [{
                        id: 'some-existing-client'
                    }]
                };
                nextAppUser = {
                    _id: 1
                };
                client = {
                    id: 'some-client_id'
                };
            });

            it('should fetch conversation and add client to user', () => {
                mockedStore.dispatch(updateUser(currentAppUser, nextAppUser, client));
                getMessagesStub.should.have.been.calledOnce;
                setUserSpy.should.have.been.calledWithMatch({
                    clients: [
                        {
                            id: 'some-existing-client'
                        },
                        client
                    ]
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
