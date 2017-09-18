import sinon from 'sinon';
import Raven from 'raven-js';

import { createMock as createThrottleMock } from '../../mocks/throttle';
import { createMockedStore, findActionsByType, generateBaseStoreProps } from '../../utils/redux';

import * as conversationActions from '../../../src/frame/js/actions/conversation';
import { __Rewire__ as ConversationActionsRewire, __RewireAPI__ as ConversationActionsRewireAPI } from '../../../src/frame/js/actions/conversation';
import { updateUser, setUser } from '../../../src/frame/js/actions/user';
import { setConfig } from '../../../src/frame/js/actions/config';
import { setAuth } from '../../../src/frame/js/actions/auth';
import { showErrorNotification, showConnectNotification } from '../../../src/frame/js/actions/app-state';
import { unsetFayeSubscriptions } from '../../../src/frame/js/actions/faye';
import { setItem, removeItem } from '../../../src/frame/js/utils/storage';

import { SEND_STATUS, LOCATION_ERRORS } from '../../../src/frame/js/constants/message';

const handleUserConversationResponse = ConversationActionsRewireAPI.__get__('handleUserConversationResponse');

describe('Conversation Actions', () => {
    let sandbox;
    let mockedStore;

    let replaceMessageSpy;
    let setConversationSpy;
    let startConversationStub;
    let getMessagesStub;
    let httpStub;
    let getWindowLocationStub;
    let immediateUpdateStub;
    let updateUserSpy;
    let showErrorNotificationSpy;
    let unsetFayeSubscriptionsSpy;
    let showConnectNotificationSpy;
    let isFileTypeSupportedStub;
    let resizeImageStub;
    let disconnectClientSpy;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(() => {
        // Disable throttling for unit tests
        ConversationActionsRewire('Throttle', createThrottleMock(sandbox));

        // Conversation actions
        replaceMessageSpy = sandbox.spy(conversationActions.replaceMessage);
        ConversationActionsRewire('replaceMessage', replaceMessageSpy);
        setConversationSpy = sandbox.spy(conversationActions.setConversation);
        ConversationActionsRewire('setConversation', setConversationSpy);


        startConversationStub = sandbox.stub().returnsAsyncThunk();
        ConversationActionsRewire('startConversation', startConversationStub);
        getMessagesStub = sandbox.stub().returnsAsyncThunk({
            value: {
                conversation: {},
                messages: []
            }
        });
        ConversationActionsRewire('_getMessages', getMessagesStub);

        // Http actions
        httpStub = sandbox.stub().returnsAsyncThunk({
            value: {
                response: {
                    status: 200
                }
            }
        });
        ConversationActionsRewire('http', httpStub);

        // Media Utils
        ConversationActionsRewire('isImageUploadSupported', sandbox.stub().returns(true));
        isFileTypeSupportedStub = sandbox.stub();
        ConversationActionsRewire('isFileTypeSupported', isFileTypeSupportedStub);
        resizeImageStub = sandbox.stub();
        ConversationActionsRewire('resizeImage', resizeImageStub);
        ConversationActionsRewire('getBlobFromDataUrl', sandbox.stub().returns('this-is-a-blob'));

        // Device utils
        ConversationActionsRewire('getClientId', sandbox.stub().returns('1234'));
        ConversationActionsRewire('getClientInfo', sandbox.stub().returns({
            id: '1234'
        }));

        // User utils
        ConversationActionsRewire('hasLinkableChannels', sandbox.stub().returns(true));
        ConversationActionsRewire('isChannelLinked', sandbox.stub().returns(false));

        // DOM utils
        getWindowLocationStub = sandbox.stub();
        ConversationActionsRewire('getWindowLocation', getWindowLocationStub);

        // User actions
        updateUserSpy = sandbox.spy(updateUser);
        ConversationActionsRewire('updateUser', updateUserSpy);
        immediateUpdateStub = sandbox.stub().returnsAsyncThunk();
        ConversationActionsRewire('immediateUpdate', immediateUpdateStub);

        // AppState actions
        showConnectNotificationSpy = sandbox.spy(showConnectNotification);
        ConversationActionsRewire('showConnectNotification', showConnectNotificationSpy);
        showErrorNotificationSpy = sandbox.spy(showErrorNotification);
        ConversationActionsRewire('showErrorNotification', showErrorNotificationSpy);

        // Faye actions
        disconnectClientSpy = sandbox.spy();
        ConversationActionsRewire('disconnectClient', disconnectClientSpy);
        unsetFayeSubscriptionsSpy = sandbox.spy(unsetFayeSubscriptions);
        ConversationActionsRewire('unsetFayeSubscriptions', unsetFayeSubscriptionsSpy);
    });

    afterEach(() => {
        sandbox.restore();
    });

    const conversationStartedSuite = (action, extraProps = {}) => {
        describe('start conversation', () => {
            beforeEach(() => {
                mockedStore = createMockedStore(sandbox, generateBaseStoreProps(extraProps));
            });

            it('should call startConversation', () => {
                return mockedStore.dispatch(action).then(() => {
                    startConversationStub.should.have.been.calledOnce;
                });
            });
        });
    };

    describe('handleConnectNotification', () => {
        it('should show connect notification on first appuser message', () => {
            mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                conversation: {
                    messages: [
                        {
                            received: 1,
                            role: 'appUser'
                        }
                    ]
                },
                config: {
                    integrations: [
                        {
                            type: 'messenger'
                        }
                    ]
                }
            }));

            mockedStore.dispatch(conversationActions.handleConnectNotification({}));
            showConnectNotificationSpy.should.have.been.calledOnce;
        });

        it('should show connect notification 24 hours later', () => {
            mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                conversation: {
                    messages: [
                        {
                            received: 1,
                            role: 'appUser'
                        },
                        {
                            received: Date.now(),
                            role: 'appUser'
                        }
                    ]
                },
                config: {
                    integrations: [
                        {
                            type: 'messenger'
                        }
                    ]
                }
            }));

            mockedStore.dispatch(conversationActions.handleConnectNotification({}));
            showConnectNotificationSpy.should.have.been.calledOnce;

        });

        it('should not show connect notification if it\'s been less than 24 hours', () => {
            mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                conversation: {
                    messages: [
                        {
                            received: Date.now() + 1,
                            role: 'appUser'
                        },
                        {
                            received: Date.now() + 2,
                            role: 'appUser'
                        }
                    ]
                },
                config: {
                    integrations: [
                        {
                            type: 'messenger'
                        }
                    ]
                }
            }));

            mockedStore.dispatch(conversationActions.handleConnectNotification({}));
            showConnectNotificationSpy.should.not.have.been.called;
        });
    });

    describe('sendMessage', () => {
        let postSendMessageStub;
        const message = {
            conversation: 'conversation',
            _clientId: 2,
            message: 'message'
        };

        beforeEach(() => {
            postSendMessageStub = sandbox.stub().returnsAsyncThunk({
                value: message
            });
            ConversationActionsRewire('postSendMessage', postSendMessageStub);
        });

        conversationStartedSuite(conversationActions.sendMessage('message'));

        it('should add message and send message', () => {
            mockedStore = createMockedStore(sandbox, generateBaseStoreProps());

            return mockedStore.dispatch(conversationActions.sendMessage('message')).then(() => {
                const actions = findActionsByType(mockedStore.getActions(), conversationActions.ADD_MESSAGE);
                actions.length.should.eq(1);
                actions[0].message.text.should.eq('message');
                postSendMessageStub.should.have.been.calledWithMatch({
                    text: 'message'
                });
            });
        });

        it('should accept string or message properties', () => {
            mockedStore = createMockedStore(sandbox, generateBaseStoreProps());

            return mockedStore.dispatch(conversationActions.sendMessage('message'))
                .then(() => mockedStore.dispatch(conversationActions.sendMessage({
                    type: 'text',
                    text: 'message'
                })))
                .then(() => {
                    postSendMessageStub.should.have.been.calledTwice;
                    postSendMessageStub.firstCall.args[0].type.should.eql('text');
                    postSendMessageStub.firstCall.args[0].text.should.eql('message');
                    postSendMessageStub.secondCall.args[0].type.should.eql('text');
                    postSendMessageStub.secondCall.args[0].text.should.eql('message');
                });
        });

        describe('errors', () => {
            beforeEach(() => {
                postSendMessageStub = sandbox.stub().returnsAsyncThunk({
                    rejects: true
                });
                ConversationActionsRewire('postSendMessage', postSendMessageStub);
            });

            it('should update message send status', () => {
                mockedStore = createMockedStore(sandbox, generateBaseStoreProps());
                return mockedStore.dispatch(conversationActions.sendMessage(message))
                    .then(() => {
                        replaceMessageSpy.should.have.been.calledWith({
                            _clientId: message._clientId
                        });
                        replaceMessageSpy.args[0][1].sendStatus.should.eql(SEND_STATUS.FAILED);
                    });
            });
        });
    });

    describe('sendLocation', () => {
        let postSendMessageStub;
        const message = {
            conversation: 'conversation',
            _clientId: 2,
            message: 'message'
        };

        let locationMessage;

        beforeEach(() => {
            postSendMessageStub = sandbox.stub().returnsAsyncThunk({
                value: message
            });
            ConversationActionsRewire('postSendMessage', postSendMessageStub);
            locationMessage = {
                type: 'location',
                _clientSent: Date.now() / 1000
            };

            if (!navigator.geolocation) {
                // in case of PhantomJS for instance
                navigator.geolocation = {
                    getCurrentPosition: function() {}
                };
            }

            sandbox.stub(navigator.geolocation, 'getCurrentPosition').yields({
                coords: {
                    latitude: 10,
                    longitude: 10
                }
            });
        });

        conversationStartedSuite(conversationActions.sendLocation(locationMessage));

        const getCurrentLocationFailsSuite = (action) => {
            let clock;

            describe('getting the current position', () => {
                beforeEach(() => {
                    mockedStore = createMockedStore(sandbox, generateBaseStoreProps());
                    sandbox.stub(window, 'alert');
                    clock = sandbox.useFakeTimers();
                    getWindowLocationStub.returns({
                        protocol: 'https:'
                    });
                });

                afterEach(() => {
                    clock.restore();
                });

                const stubGeolocationFailure = (args, tick = 100) => {
                    // reset stub defined above
                    navigator.geolocation.getCurrentPosition.restore();
                    sandbox.stub(navigator.geolocation, 'getCurrentPosition').callsFake((success, failure) => {
                        failure(args);
                        clock.tick(tick);
                    });
                };

                describe('fails with LOCATION_ERRORS.PERMISSION_DENIED', () => {
                    beforeEach(() => {
                        stubGeolocationFailure({
                            code: LOCATION_ERRORS.PERMISSION_DENIED
                        });
                    });

                    it('should remove the message and display an alert', () => {
                        return mockedStore.dispatch(action).then(() => {
                            const actions = findActionsByType(mockedStore.getActions(), conversationActions.REMOVE_MESSAGE);
                            actions.length.should.eq(1);
                            window.alert.should.have.been.calledOnce;
                        });
                    });
                });

                describe('fails due to a timeout', () => {
                    beforeEach(() => {
                        stubGeolocationFailure({
                            code: LOCATION_ERRORS.TIMEOUT
                        }, 100000);
                    });

                    it('should replace the message with a failed one', () => {
                        return mockedStore.dispatch(action).then(() => {
                            replaceMessageSpy.should.have.been.calledOnce;
                            window.alert.should.not.have.been.called;
                        });
                    });
                });

                describe('fails unexpectedly', () => {
                    beforeEach(() => {
                        stubGeolocationFailure({
                            code: 10000
                        });
                    });

                    it('should replace the message with a failed one', () => {
                        return mockedStore.dispatch(action).then(() => {
                            replaceMessageSpy.should.have.been.calledOnce;
                            window.alert.should.not.have.been.called;
                        });
                    });
                });

                describe('fails due to http protocol', () => {
                    beforeEach(() => {
                        getWindowLocationStub.returns({
                            protocol: 'http:'
                        });

                        stubGeolocationFailure({
                            code: LOCATION_ERRORS.PERMISSION_DENIED
                        });
                    });

                    it('should remove the message and display an alert', () => {
                        return mockedStore.dispatch(action).then(() => {
                            const actions = findActionsByType(mockedStore.getActions(), conversationActions.REMOVE_MESSAGE);
                            actions.length.should.eq(1);
                            window.alert.should.have.been.calledOnce;
                        });
                    });
                });
            });
        };

        describe('message exists with coordinates', () => {
            beforeEach(() => {
                Object.assign(locationMessage, {
                    coordinates: {
                        lat: 10.0,
                        long: 10.0
                    }
                });
            });

            it('should postSendMessage', () => {
                mockedStore = createMockedStore(sandbox, generateBaseStoreProps());

                return mockedStore.dispatch(conversationActions.sendLocation(locationMessage)).then(() => {
                    postSendMessageStub.should.have.been.calledOnce;
                });
            });
        });

        describe('message exists without coordinates', () => {
            it('should addMessage', () => {
                mockedStore = createMockedStore(sandbox, generateBaseStoreProps());

                return mockedStore.dispatch(conversationActions.sendLocation(locationMessage)).then(() => {
                    navigator.geolocation.getCurrentPosition.should.have.been.calledOnce;
                    replaceMessageSpy.should.have.been.called;
                    postSendMessageStub.should.have.been.calledOnce;
                });
            });

            getCurrentLocationFailsSuite(conversationActions.sendLocation(locationMessage));
        });

        describe('message does not yet exist', () => {
            it('should addMessage', () => {
                mockedStore = createMockedStore(sandbox, generateBaseStoreProps());

                return mockedStore.dispatch(conversationActions.sendLocation()).then(() => {
                    navigator.geolocation.getCurrentPosition.should.have.been.calledOnce;
                    replaceMessageSpy.should.have.been.called;
                    postSendMessageStub.should.have.been.calledOnce;
                });
            });

            getCurrentLocationFailsSuite(conversationActions.sendLocation());
        });
    });

    describe('resendMessage', () => {
        let postSendMessageStub;
        let postUploadImageStub;
        const message = {
            conversation: 'conversation',
            _clientId: 2,
            text: 'message'
        };

        beforeEach(() => {
            postSendMessageStub = sandbox.stub();
            postUploadImageStub = sandbox.stub();
            ConversationActionsRewire('postSendMessage', postSendMessageStub);
            ConversationActionsRewire('postUploadImage', postUploadImageStub);
        });


        describe('message is an image', () => {
            beforeEach(() => {
                postUploadImageStub.returnsAsyncThunk();
                Object.assign(message, {
                    sendStatus: SEND_STATUS.FAILED,
                    type: 'image'
                });

                mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                    user: {
                        _id: '1',
                        conversationStarted: true
                    },
                    conversation: {
                        messages: [message]
                    }
                }));
            });

            conversationStartedSuite(conversationActions.resendMessage(message._clientId), {
                conversation: {
                    messages: [message]
                }
            });

            it('should update send status and post upload image', () => {
                return mockedStore.dispatch(conversationActions.resendMessage(message._clientId)).then(() => {
                    postUploadImageStub.should.have.been.calledOnce;
                    replaceMessageSpy.should.have.been.calledTwice;
                });
            });
        });

        describe('message is text', () => {
            beforeEach(() => {
                Object.assign(message, {
                    sendStatus: SEND_STATUS.FAILED,
                    type: 'text'
                });
                postSendMessageStub.returnsAsyncThunk({
                    value: message
                });

                mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                    user: {
                        _id: '1',
                        conversationStarted: true
                    },
                    conversation: {
                        messages: [message]
                    }
                }));
            });

            conversationStartedSuite(conversationActions.resendMessage(message._clientId), {
                conversation: {
                    messages: [message]
                }
            });

            it('should update send status and send message', () => {
                return mockedStore.dispatch(conversationActions.resendMessage(message._clientId)).then(() => {
                    postSendMessageStub.should.have.been.calledOnce;
                    replaceMessageSpy.should.have.been.calledTwice;
                });
            });
        });
    });

    describe('uploadImage', () => {
        let postUploadImageStub;
        const image = {
            conversation: 'conversation'
        };

        beforeEach(() => {
            isFileTypeSupportedStub.returns(true);
            resizeImageStub.resolves({});
            postUploadImageStub = sandbox.stub().returnsAsyncThunk({
                value: image
            });
            ConversationActionsRewire('postUploadImage', postUploadImageStub);
        });

        conversationStartedSuite(conversationActions.uploadImage({}));

        describe('errors', () => {
            beforeEach(() => {
                mockedStore = createMockedStore(sandbox, generateBaseStoreProps());
            });

            describe('unsupported file type', () => {
                beforeEach(() => {
                    isFileTypeSupportedStub.returns(false);
                });

                it('should show an error notification', () => {
                    return mockedStore.dispatch(conversationActions.uploadImage({})).then(() => {
                        isFileTypeSupportedStub.should.have.been.called;
                        resizeImageStub.should.not.have.been.called;
                        showErrorNotificationSpy.should.have.been.called;
                    });
                });
            });

            describe('resize error', () => {
                beforeEach(() => {
                    isFileTypeSupportedStub.returns(true);
                    resizeImageStub.rejects();
                });

                it('should show an error notification', () => {
                    return mockedStore.dispatch(conversationActions.uploadImage({})).then(() => {
                        isFileTypeSupportedStub.should.have.been.called;
                        resizeImageStub.should.have.been.called;
                        showErrorNotificationSpy.should.have.been.called;
                    });
                });
            });

            describe('upload error', () => {
                beforeEach(() => {
                    isFileTypeSupportedStub.returns(true);
                    resizeImageStub.resolves({});
                    postUploadImageStub = sandbox.stub().returnsAsyncThunk({
                        rejects: true
                    });
                    ConversationActionsRewire('postUploadImage', postUploadImageStub);
                });

                it('should update message send status', () => {
                    return mockedStore.dispatch(conversationActions.uploadImage({})).then(() => {
                        isFileTypeSupportedStub.should.have.been.called;
                        resizeImageStub.should.have.been.called;
                        postUploadImageStub.should.have.been.called;

                        replaceMessageSpy.should.have.been.calledOnce;
                        replaceMessageSpy.args[0][1].sendStatus.should.eql(SEND_STATUS.FAILED);
                    });
                });
            });
        });
    });

    describe('getMessages', () => {
        beforeEach(() => {
            mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                user: {
                    _id: '1'
                }
            }));
        });

        it('should call _getMessages and dispatch conversation', () => {
            return mockedStore.dispatch(conversationActions.getMessages()).then((response) => {
                getMessagesStub.should.have.been.calledOnce;

                response.should.deep.eq({
                    conversation: {},
                    messages: []
                });

                setConversationSpy.should.have.been.called;
            });
        });
    });

    describe('resetUnreadCount', () => {
        it('should reset unread count to 0', () => {
            const props = generateBaseStoreProps({
                user: {
                    _id: '1'
                },
                conversation: {
                    unreadCount: 20
                }
            });
            mockedStore = createMockedStore(sandbox, props);
            mockedStore.dispatch(conversationActions.resetUnreadCount());
            httpStub.should.have.been.calledWith('POST', `/apps/${props.config.appId}/appusers/${props.user._id}/conversation/read`);
        });
    });

    describe('postPostbacks', () => {
        const actionId = '1234';
        let storeProps;
        beforeEach(() => {
            storeProps = generateBaseStoreProps({
                user: {
                    _id: '1'
                },
                ui: {
                    text: {
                        actionPostbackError: 'action postback error'
                    }
                }
            });
            mockedStore = createMockedStore(sandbox, storeProps);
        });

        it('should post postback', () => {
            mockedStore.dispatch(conversationActions.postPostback(actionId));
            httpStub.should.have.been.calledWithMatch('POST', `/apps/${storeProps.config.appId}/appusers/${storeProps.user._id}/postback`, {
                postback: {
                    actionId
                },
                sender: {
                    type: 'appUser',
                    client: {
                        id: '1234'
                    }
                }
            });
        });

        describe('errors', () => {
            beforeEach(() => {
                httpStub.returnsAsyncThunk({
                    rejects: true
                });
            });

            it('should show an error notification', () => {
                return mockedStore.dispatch(conversationActions.postPostback(actionId)).then(() => {
                    httpStub.should.have.been.calledWithMatch('POST', `/apps/${storeProps.config.appId}/appusers/${storeProps.user._id}/postback`, {
                        postback: {
                            actionId
                        },
                        sender: {
                            type: 'appUser',
                            client: {
                                id: '1234'
                            }
                        }
                    });
                    showErrorNotificationSpy.should.have.been.calledWithMatch('action postback error');
                });
            });
        });
    });

    describe('fetchMoreMessages', () => {
        beforeEach(() => {
            getMessagesStub.returnsAsyncThunk({
                value: {
                    conversation: {},
                    previous: '23'
                }
            });
        });

        it('should use timestamp of first message as before parameter', () => {
            mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                user: {
                    _id: '1'
                },
                conversation: {
                    hasMoreMessages: true,
                    isFetchingMoreMessagesFromServer: false,
                    messages: [{
                        received: 123
                    }]
                }
            }));
            return mockedStore.dispatch(conversationActions.fetchMoreMessages()).then(() => {
                getMessagesStub.should.have.been.calledWithMatch({
                    before: 123
                });
            });
        });

        it('should not fetch if there are no more messages', () => {
            mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                conversation: {
                    hasMoreMessages: false,
                    isFetchingMoreMessagesFromServer: false,
                    messages: []
                }
            }));
            return mockedStore.dispatch(conversationActions.fetchMoreMessages()).then(() => {
                getMessagesStub.should.not.have.been.called;
            });
        });

        it('should not fetch if already fetching from server', () => {
            mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                conversation: {
                    hasMoreMessages: true,
                    isFetchingMoreMessagesFromServer: true,
                    messages: []
                }
            }));
            return mockedStore.dispatch(conversationActions.fetchMoreMessages()).then(() => {
                getMessagesStub.should.not.have.been.called;
            });
        });
    });

    describe('fetchUserConversation', () => {
        let handleUserConversationResponseStub;
        let mockedStore;
        beforeEach(() => {
            handleUserConversationResponseStub = sandbox.stub().returnsAsyncThunk();
            ConversationActionsRewire('handleUserConversationResponse', handleUserConversationResponseStub);

            const props = generateBaseStoreProps({
                user: {
                    _id: '1'
                }
            });
            mockedStore = createMockedStore(sandbox, props);
        });

        it('should call handleUserConversationResponse', () => {
            const {config: {appId}, user: {_id}} = mockedStore.getState();
            return mockedStore.dispatch(conversationActions.fetchUserConversation())
                .then(() => {
                    httpStub.should.have.been.calledWith('GET', `/apps/${appId}/appusers/${_id}`);
                    handleUserConversationResponseStub.should.have.been.calledOnce;
                });
        });
    });


    describe('handleUserConversationResponse', () => {
        let appId;
        let setUserContextStub;
        let subscribeFayeStub;
        let setUserSpy;
        let setConversationSpy;
        let setMessagesSpy;
        let setConfigSpy;
        let setItemSpy;
        let removeItemSpy;
        let setAuthSpy;

        beforeEach(() => {
            subscribeFayeStub = sandbox.stub().returnsAsyncThunk();
            ConversationActionsRewire('subscribeFaye', subscribeFayeStub);
            setUserSpy = sandbox.spy(setUser);
            ConversationActionsRewire('setUser', setUserSpy);
            setConversationSpy = sandbox.spy(conversationActions.setConversation);
            ConversationActionsRewire('setConversation', setConversationSpy);
            setMessagesSpy = sandbox.spy(conversationActions.setMessages);
            ConversationActionsRewire('setMessages', setMessagesSpy);
            setConfigSpy = sandbox.spy(setConfig);
            ConversationActionsRewire('setConfig', setConfigSpy);
            setAuthSpy = sandbox.spy(setAuth);
            ConversationActionsRewire('setAuth', setAuthSpy);
            setItemSpy = sandbox.spy(setItem);
            removeItemSpy = sandbox.spy(removeItem);
            ConversationActionsRewire('storage', {
                setItem: setItemSpy,
                removeItem: removeItemSpy
            });

            setUserContextStub = sandbox.stub(Raven, 'setUserContext');

            mockedStore = createMockedStore(sandbox);
            appId = mockedStore.getState().config.appId;
        });

        const promises = [
            // hasUserId: true and hasSessionToken: true is not a scenario that should happen
            {
                hasUserId: true,
                hasSessionToken: false,
                hasSettings: true,
                conversationStarted: true
            },
            {
                hasUserId: false,
                hasSessionToken: false,
                hasSettings: true,
                conversationStarted: true
            },
            {
                hasUserId: false,
                hasSessionToken: true,
                hasSettings: true,
                conversationStarted: true
            },
            {
                hasUserId: true,
                hasSessionToken: false,
                hasSettings: true,
                conversationStarted: false
            },
            {
                hasUserId: false,
                hasSessionToken: false,
                hasSettings: true,
                conversationStarted: false
            },
            {
                hasUserId: false,
                hasSessionToken: true,
                hasSettings: true,
                conversationStarted: false
            }
        ].map((expectations) => {
            const {hasUserId, hasSessionToken, hasSettings, conversationStarted} = expectations;

            const payload = {
                appUser: {
                    _id: 'some-app-user-id',
                    conversationStarted
                }
            };

            if (hasUserId) {
                payload.appUser.userId = 'some-user-id';
            }

            if (hasSessionToken) {
                payload.sessionToken = 'some-session-token';
            }

            if (hasSettings) {
                payload.settings = {
                    first: 'first',
                    second: 'second',
                    third: 'third'
                };
            }

            return {
                expectations,
                payload
            };
        }).map(({expectations, payload}) => {
            const {hasUserId, hasSessionToken, hasSettings, conversationStarted} = expectations;

            const generateExpectationString = (expectations) => {
                return Object.keys(expectations).map((key) => `${key}: ${expectations[key]}`).join(', ');
            };

            it(`should meet expectations (${generateExpectationString(expectations)})`, () => {
                return mockedStore.dispatch(handleUserConversationResponse(payload)).then(() => {
                    setUserContextStub.should.have.been.calledWith({
                        id: 'some-app-user-id'
                    });

                    setMessagesSpy.should.have.been.calledOnce;
                    setUserSpy.should.have.been.calledOnce;
                    setConversationSpy.should.have.been.calledOnce;

                    if (hasUserId) {
                        removeItemSpy.should.have.been.calledWith(`${appId}.appUserId`);
                    } else {
                        setItemSpy.should.have.been.calledWith(`${appId}.appUserId`, 'some-app-user-id');
                    }

                    if (hasSessionToken) {
                        setItemSpy.should.have.been.calledWith(`${appId}.sessionToken`, 'some-session-token');
                        setAuthSpy.should.have.been.calledWith({
                            sessionToken: 'some-session-token'
                        });
                    } else {
                        setItemSpy.should.not.have.been.calledWith(`${appId}.sessionToken`);
                        setAuthSpy.should.not.have.been.called;
                    }

                    if (conversationStarted) {
                        subscribeFayeStub.should.have.been.calledOnce;
                    } else {
                        subscribeFayeStub.should.not.have.been.called;
                    }

                    if (hasSettings) {
                        setConfigSpy.should.have.been.calledThrice;
                        setConfigSpy.should.have.been.calledWith('first', 'first');
                        setConfigSpy.should.have.been.calledWith('second', 'second');
                        setConfigSpy.should.have.been.calledWith('third', 'third');
                    } else {
                        setConfigSpy.should.not.have.been.called;
                    }
                });
            });
        });

        return Promise.all(promises);
    });
});
