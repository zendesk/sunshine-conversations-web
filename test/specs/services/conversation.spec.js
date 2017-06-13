import sinon from 'sinon';

import { createMock as createCoreMock } from '../../mocks/core';
import { createMock as createThrottleMock } from '../../mocks/throttle';
import { createMockedStore } from '../../utils/redux';

import * as conversationService from '../../../src/frame/js/services/conversation';
import * as conversationActions from '../../../src/frame/js/actions/conversation-actions';
import { showConnectNotification } from '../../../src/frame/js/services/app';
import { updateUser } from '../../../src/frame/js/actions/user-actions';
import { showErrorNotification } from '../../../src/frame/js/actions/app-state-actions';
import { unsetFayeSubscriptions } from '../../../src/frame/js/actions/faye-actions';
import { __Rewire__ as RewireConversationService } from '../../../src/frame/js/services/conversation';

import { SEND_STATUS, LOCATION_ERRORS } from '../../../src/frame/js/constants/message';

function getProps(props = {}) {
    const defaultProps = {
        user: {
            clients: {},
            email: 'hello@smooch.io'
        },
        app: {
            integrations: [
                {
                    _id: '12241',
                    type: 'telegram',
                    username: 'chloebot'
                }
            ],
            settings: {
                web: {
                    channels: {
                        telegram: true,
                        messenger: false,
                        line: false,
                        twilio: false,
                        wechat: false
                    }
                }
            }
        },
        conversation: {
            messages: []
        },
        appState: {
            emailCaptureEnabled: true
        },
        faye: {
            userSubscription: null,
            conversationSubscription: null
        },
        ui: {
            text: {
                locationServicesDenied: 'location services denied'
            }
        }
    };

    return Object.assign({}, defaultProps, props);
}

describe('Conversation service', () => {
    let sandbox;
    let coreMock;
    let mockedStore;
    let conversationSubscriptionMock;
    let userSubscriptionMock;

    let getWindowLocationStub;
    let immediateUpdateStub;
    let setConversationSpy;
    let replaceMessageSpy;
    let addMessagesSpy;
    let addMessageActionSpy;
    let removeMessageActionSpy;
    let resetUnreadCountActionSpy;
    let updateUserSpy;
    let showErrorNotificationSpy;
    let unsetFayeSubscriptionsSpy;
    let showConnectNotificationSpy;
    let isFileTypeSupportedStub;
    let resizeImageStub;
    let subscribeConversationStub;
    let subscribeUserStub;
    let disconnectClientSpy;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(() => {
        // Disable throttling for unit tests
        RewireConversationService('Throttle', createThrottleMock(sandbox));

        coreMock = createCoreMock(sandbox);
        coreMock.appUsers.getMessages.resolves({
            conversation: {
            },
            messages: []
        });

        RewireConversationService('core', () => coreMock);

        conversationSubscriptionMock = {
            cancel: sandbox.stub().resolves()
        };

        userSubscriptionMock = {
            cancel: sandbox.stub().resolves()
        };

        // Faye service
        disconnectClientSpy = sandbox.spy();
        RewireConversationService('disconnectClient', disconnectClientSpy);
        subscribeConversationStub = sandbox.stub().returns(() => Promise.resolve());
        RewireConversationService('subscribeConversation', subscribeConversationStub);
        RewireConversationService('subscribeConversationActivity', sandbox.stub().returns(() => Promise.resolve()));
        subscribeUserStub = sandbox.stub().returns(() => Promise.resolve());
        RewireConversationService('subscribeUser', subscribeUserStub);

        // Media Utils
        RewireConversationService('isImageUploadSupported', sandbox.stub().returns(true));
        isFileTypeSupportedStub = sandbox.stub();
        RewireConversationService('isFileTypeSupported', isFileTypeSupportedStub);
        resizeImageStub = sandbox.stub();
        RewireConversationService('resizeImage', resizeImageStub);
        RewireConversationService('getBlobFromDataUrl', sandbox.stub().returns('this-is-a-blob'));

        // Device utils
        RewireConversationService('getDeviceId', sandbox.stub().returns('1234'));

        // User utils
        RewireConversationService('hasLinkableChannels', sandbox.stub().returns(true));
        RewireConversationService('isChannelLinked', sandbox.stub().returns(false));

        // DOM utils
        getWindowLocationStub = sandbox.stub();
        RewireConversationService('getWindowLocation', getWindowLocationStub);

        // App service
        showConnectNotificationSpy = sandbox.spy(showConnectNotification);
        RewireConversationService('showConnectNotification', showConnectNotificationSpy);

        // User service
        immediateUpdateStub = sandbox.stub().returns(() => Promise.resolve());
        RewireConversationService('immediateUpdate', immediateUpdateStub);

        // Conversation actions
        setConversationSpy = sandbox.spy(conversationActions.setConversation);
        RewireConversationService('setConversation', setConversationSpy);
        replaceMessageSpy = sandbox.spy(conversationActions.replaceMessage);
        RewireConversationService('replaceMessage', replaceMessageSpy);
        addMessagesSpy = sandbox.spy(conversationActions.addMessages);
        RewireConversationService('addMessages', addMessagesSpy);
        addMessageActionSpy = sandbox.spy(conversationActions.addMessage);
        RewireConversationService('addMessageAction', addMessageActionSpy);
        removeMessageActionSpy = sandbox.spy(conversationActions.removeMessage);
        RewireConversationService('removeMessageAction', removeMessageActionSpy);
        resetUnreadCountActionSpy = sandbox.spy(conversationActions.resetUnreadCount);
        RewireConversationService('resetUnreadCountAction', resetUnreadCountActionSpy);

        // User actions
        updateUserSpy = sandbox.spy(updateUser);
        RewireConversationService('updateUser', updateUserSpy);

        // AppState actions
        showErrorNotificationSpy = sandbox.spy(showErrorNotification);
        RewireConversationService('showErrorNotification', showErrorNotificationSpy);

        // Faye actions
        unsetFayeSubscriptionsSpy = sandbox.spy(unsetFayeSubscriptions);
        RewireConversationService('unsetFayeSubscriptions', unsetFayeSubscriptionsSpy);
    });

    afterEach(() => {
        sandbox.restore();
    });

    const conversationStartedSuite = (action, extraProps = {}) => {
        describe('conversation started', () => {
            beforeEach(() => {
                mockedStore = createMockedStore(sandbox, getProps(Object.assign({
                    user: {
                        _id: '1',
                        conversationStarted: true
                    }
                }, extraProps)));
            });

            it('should replace message', () => {
                return mockedStore.dispatch(action).then(() => {
                    immediateUpdateStub.should.have.been.calledOnce;

                    setConversationSpy.should.not.have.been.called;
                    replaceMessageSpy.should.have.been.called;
                    updateUserSpy.should.not.have.been.called;
                });
            });
        });

        describe('conversation not started', () => {
            beforeEach(() => {
                mockedStore = createMockedStore(sandbox, getProps(Object.assign({
                    user: {
                        _id: '1',
                        conversationStarted: false
                    }
                }, extraProps)));
            });

            it('should set conversation to started', () => {
                return mockedStore.dispatch(action).then(() => {
                    immediateUpdateStub.should.have.been.calledOnce;

                    setConversationSpy.should.have.been.called;
                    replaceMessageSpy.should.have.been.called;
                    updateUserSpy.should.have.been.called;
                });
            });
        });
    };

    describe('handleConnectNotification', () => {
        it('should show connect notification on first appuser message', () => {
            mockedStore = createMockedStore(sandbox, getProps({
                conversation: {
                    messages: [
                        {
                            received: 1,
                            role: 'appUser'
                        }
                    ]
                }
            }));

            mockedStore.dispatch(conversationService.handleConnectNotification({}));
            showConnectNotificationSpy.should.have.been.calledOnce;
        });

        it('should show connect notification 24 hours later', () => {
            mockedStore = createMockedStore(sandbox, getProps({
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
                }
            }));

            mockedStore.dispatch(conversationService.handleConnectNotification({}));
            showConnectNotificationSpy.should.have.been.calledOnce;

        });

        it('should not show connect notification if it\'s been less than 24 hours', () => {
            mockedStore = createMockedStore(sandbox, getProps({
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
                }
            }));

            mockedStore.dispatch(conversationService.handleConnectNotification({}));
            showConnectNotificationSpy.should.not.have.been.called;
        });
    });

    describe('sendMessage', () => {
        const message = {
            conversation: 'conversation',
            _clientId: 2,
            message: 'message'
        };

        beforeEach(() => {
            coreMock.appUsers.sendMessage.resolves(message);
        });

        conversationStartedSuite(conversationService.sendMessage('message'));

        it('should add message and send message', () => {
            mockedStore = createMockedStore(sandbox, getProps());

            return mockedStore.dispatch(conversationService.sendMessage('message')).then(() => {
                addMessageActionSpy.should.have.been.calledOnce;
                coreMock.appUsers.sendMessage.should.have.been.calledOnce;
            });
        });

        it('should accept string or message properties', () => {
            mockedStore = createMockedStore(sandbox, getProps());

            return mockedStore.dispatch(conversationService.sendMessage('message'))
                .then(() => mockedStore.dispatch(conversationService.sendMessage({
                    type: 'text',
                    text: 'message'
                })))
                .then(() => {
                    addMessageActionSpy.should.have.been.calledTwice;
                    coreMock.appUsers.sendMessage.should.have.been.calledTwice;

                    coreMock.appUsers.sendMessage.firstCall.args[1].type.should.eql('text');
                    coreMock.appUsers.sendMessage.firstCall.args[1].text.should.eql('message');
                    coreMock.appUsers.sendMessage.secondCall.args[1].type.should.eql('text');
                    coreMock.appUsers.sendMessage.secondCall.args[1].text.should.eql('message');
                });
        });

        describe('errors', () => {
            beforeEach(() => {
                coreMock.appUsers.sendMessage.rejects();
            });

            it('should update message send status', () => {
                mockedStore = createMockedStore(sandbox, getProps());
                return mockedStore.dispatch(conversationService.sendMessage(message))
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
        const message = {
            conversation: 'conversation',
            _clientId: 2,
            message: 'message'
        };

        let locationMessage;

        beforeEach(() => {
            coreMock.appUsers.sendMessage.resolves(message);
            locationMessage = {
                type: 'location',
                _clientSent: Date.now() / 1000
            };
            sandbox.stub(navigator.geolocation, 'getCurrentPosition').yields({
                coords: {
                    latitude: 10,
                    longitude: 10
                }
            });
        });

        conversationStartedSuite(conversationService.sendLocation(locationMessage));

        const getCurrentLocationFailsSuite = (action) => {
            let clock;

            describe('getting the current position', () => {
                beforeEach(() => {
                    mockedStore = createMockedStore(sandbox, getProps());
                    sandbox.stub(window, 'alert');
                    clock = sinon.useFakeTimers();
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
                    sandbox.stub(navigator.geolocation, 'getCurrentPosition', (success, failure) => {
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
                            removeMessageActionSpy.should.have.been.called;
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
                            removeMessageActionSpy.should.have.been.called;
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
                mockedStore = createMockedStore(sandbox, getProps());

                return mockedStore.dispatch(conversationService.sendLocation(locationMessage)).then(() => {
                    addMessageActionSpy.should.not.have.been.called;
                    coreMock.appUsers.sendMessage.should.have.been.calledOnce;
                });
            });
        });

        describe('message exists without coordinates', () => {
            it('should addMessage', () => {
                mockedStore = createMockedStore(sandbox, getProps());

                return mockedStore.dispatch(conversationService.sendLocation(locationMessage)).then(() => {
                    addMessageActionSpy.should.not.have.been.called;
                    navigator.geolocation.getCurrentPosition.should.have.been.calledOnce;
                    replaceMessageSpy.should.have.been.called;
                    coreMock.appUsers.sendMessage.should.have.been.calledOnce;
                });
            });

            getCurrentLocationFailsSuite(conversationService.sendLocation(locationMessage));
        });

        describe('message does not yet exist', () => {
            it('should addMessage', () => {
                mockedStore = createMockedStore(sandbox, getProps());

                return mockedStore.dispatch(conversationService.sendLocation()).then(() => {
                    addMessageActionSpy.should.have.been.calledOnce;
                    navigator.geolocation.getCurrentPosition.should.have.been.calledOnce;
                    replaceMessageSpy.should.have.been.called;
                    coreMock.appUsers.sendMessage.should.have.been.calledOnce;
                });
            });

            getCurrentLocationFailsSuite(conversationService.sendLocation());
        });
    });

    describe('resendMessage', () => {
        const message = {
            conversation: 'conversation',
            _clientId: 2,
            text: 'message'
        };

        describe('message is an image', () => {
            beforeEach(() => {
                coreMock.appUsers.uploadImage.resolves(message);
                Object.assign(message, {
                    sendStatus: SEND_STATUS.FAILED,
                    type: 'image'
                });

                mockedStore = createMockedStore(sandbox, getProps(Object.assign({
                    user: {
                        _id: '1',
                        conversationStarted: true
                    },
                    conversation: {
                        messages: [message]
                    }
                })));
            });

            conversationStartedSuite(conversationService.resendMessage(message._clientId), {
                conversation: {
                    messages: [message]
                }
            });

            it('should update send status and post upload image', () => {
                return mockedStore.dispatch(conversationService.resendMessage(message._clientId)).then(() => {
                    coreMock.appUsers.uploadImage.should.have.been.calledOnce;
                    replaceMessageSpy.should.have.been.calledTwice;
                });
            });
        });

        describe('message is text', () => {
            beforeEach(() => {
                coreMock.appUsers.sendMessage.resolves(message);
                Object.assign(message, {
                    sendStatus: SEND_STATUS.FAILED,
                    type: 'text'
                });

                mockedStore = createMockedStore(sandbox, getProps(Object.assign({
                    user: {
                        _id: '1',
                        conversationStarted: true
                    },
                    conversation: {
                        messages: [message]
                    }
                })));
            });

            conversationStartedSuite(conversationService.resendMessage(message._clientId), {
                conversation: {
                    messages: [message]
                }
            });

            it('should update send status and send message', () => {
                return mockedStore.dispatch(conversationService.resendMessage(message._clientId)).then(() => {
                    coreMock.appUsers.sendMessage.should.have.been.calledOnce;
                    replaceMessageSpy.should.have.been.calledTwice;
                });
            });
        });
    });

    describe('uploadImage', () => {
        const image = {
            conversation: 'conversation'
        };

        beforeEach(() => {
            coreMock.appUsers.uploadImage.resolves(image);
            isFileTypeSupportedStub.returns(true);
            resizeImageStub.resolves({});
        });

        conversationStartedSuite(conversationService.uploadImage({}));

        describe('errors', () => {
            beforeEach(() => {
                mockedStore = createMockedStore(sandbox, getProps({
                    user: {
                        _id: '1',
                        conversationStarted: true
                    },
                    ui: {
                        text: {
                            invalidFileError: 'invalidFileError'
                        }
                    }
                }));
            });

            describe('unsupported file type', () => {
                beforeEach(() => {
                    isFileTypeSupportedStub.returns(false);
                });

                it('should show an error notification', () => {
                    return mockedStore.dispatch(conversationService.uploadImage({})).then(() => {
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
                    return mockedStore.dispatch(conversationService.uploadImage({})).then(() => {
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
                    coreMock.appUsers.uploadImage.rejects();
                });

                it('should update message send status', () => {
                    return mockedStore.dispatch(conversationService.uploadImage({})).then(() => {
                        isFileTypeSupportedStub.should.have.been.called;
                        resizeImageStub.should.have.been.called;
                        coreMock.appUsers.uploadImage.should.have.been.called;

                        replaceMessageSpy.should.have.been.calledOnce;
                        replaceMessageSpy.args[0][1].sendStatus.should.eql(SEND_STATUS.FAILED);
                    });
                });
            });
        });
    });

    describe('getMessages', () => {
        beforeEach(() => {
            mockedStore = createMockedStore(sandbox, {
                user: {
                    _id: '1'
                }
            });
        });

        it('should call smooch-core conversation api and dispatch conversation', () => {
            return mockedStore.dispatch(conversationService.getMessages()).then((response) => {
                coreMock.appUsers.getMessages.should.have.been.calledWith('1');

                response.should.deep.eq({
                    conversation: {
                    },
                    messages: []
                });

                setConversationSpy.should.have.been.called;
            });
        });
    });

    describe('connectFayeConversation', () => {
        [true, false].forEach((active) => {
            describe(`with${active ? '' : 'out'} subscription active`, () => {
                it(`should ${active ? 'not' : ''} subscribe to conversation`, () => {
                    mockedStore = active ? createMockedStore(sandbox, getProps({
                        faye: {
                            conversationSubscription: conversationSubscriptionMock
                        }
                    })) : createMockedStore(sandbox, getProps());

                    return mockedStore.dispatch(conversationService.connectFayeConversation()).then(() => {
                        if (active) {
                            subscribeConversationStub.should.not.have.been.called;
                        } else {
                            subscribeConversationStub.should.have.been.calledOnce;
                        }
                    });
                });
            });
        });
    });

    describe('connectFayeUser', () => {
        [true, false].forEach((subscribed) => {
            describe(`user ${subscribed ? '' : 'not'} subscribed`, () => {
                it(`should ${subscribed ? 'not' : ''} subscribe user`, () => {
                    mockedStore = subscribed ? createMockedStore(sandbox, getProps({
                        faye: {
                            userSubscription: userSubscriptionMock
                        }
                    })) : createMockedStore(sandbox, getProps());

                    return mockedStore.dispatch(conversationService.connectFayeUser()).then(() => {
                        if (subscribed) {
                            subscribeUserStub.should.have.not.been.called;
                        } else {
                            subscribeUserStub.should.have.been.calledOnce;
                        }
                    });
                });
            });
        });
    });

    describe('disconnectFaye', () => {
        [true, false].forEach((active) => {
            describe(`with${active ? '' : 'out'} subscription active`, () => {
                it(`should ${active ? '' : 'not'} cancel subscription`, () => {
                    mockedStore = active ? createMockedStore(sandbox, getProps({
                        faye: {
                            conversationSubscription: conversationSubscriptionMock
                        }
                    })) : createMockedStore(sandbox, getProps());
                    mockedStore.dispatch(conversationService.disconnectFaye());

                    userSubscriptionMock.cancel.should.not.have.been.called;
                    disconnectClientSpy.should.have.been.called;
                    unsetFayeSubscriptionsSpy.should.have.been.called;
                    if (active) {
                        conversationSubscriptionMock.cancel.should.have.been.called;
                    } else {
                        conversationSubscriptionMock.cancel.should.not.have.been.called;
                    }
                });
            });
        });

        [true, false].forEach((subscribed) => {
            describe(`user ${subscribed ? '' : 'not'} subscribed`, () => {
                it(`should ${subscribed ? '' : 'not'} cancel their subscription`, () => {
                    mockedStore = subscribed ? createMockedStore(sandbox, getProps({
                        faye: {
                            userSubscription: userSubscriptionMock
                        }
                    })) : createMockedStore(sandbox, getProps());
                    mockedStore.dispatch(conversationService.disconnectFaye());

                    conversationSubscriptionMock.cancel.should.not.have.been.called;
                    disconnectClientSpy.should.have.been.called;
                    unsetFayeSubscriptionsSpy.should.have.been.called;
                    if (subscribed) {
                        userSubscriptionMock.cancel.should.have.been.called;
                    } else {
                        userSubscriptionMock.cancel.should.not.have.been.called;
                    }
                });
            });
        });
    });

    describe('resetUnreadCount', () => {
        it('should reset unread count to 0', () => {
            coreMock.conversations.resetUnreadCount.resolves();
            mockedStore = createMockedStore(sandbox, getProps({
                user: {
                    _id: '1'
                },
                conversation: {
                    unreadCount: 20
                }
            }));
            mockedStore.dispatch(conversationService.resetUnreadCount());
            coreMock.conversations.resetUnreadCount.should.have.been.calledWithMatch('1');
        });
    });

    describe('handleConversationUpdated', () => {
        beforeEach(() => {
            RewireConversationService('connectFayeConversation', sandbox.stub().returns(() => Promise.resolve()));
        });

        [true, false].forEach((active) => {
            describe(`with${active ? '' : 'out'} subscription active`, () => {
                it(`should ${active ? 'not' : ''} get conversation`, () => {
                    mockedStore = active ? createMockedStore(sandbox, getProps({
                        user: {
                            _id: '1'
                        },
                        faye: {
                            conversationSubscription: conversationSubscriptionMock
                        }
                    })) : createMockedStore(sandbox, getProps());

                    return mockedStore.dispatch(conversationService.handleConversationUpdated()).then(() => {
                        if (active) {
                            coreMock.appUsers.getMessages.should.not.have.been.called;
                        } else {
                            coreMock.appUsers.getMessages.should.have.been.calledOnce;
                        }
                    });
                });
            });
        });

    });

    describe('postPostbacks', () => {
        const actionId = '1234';

        beforeEach(() => {
            coreMock.conversations.postPostback.resolves();
            mockedStore = createMockedStore(sandbox, getProps({
                user: {
                    _id: '1'
                },
                ui: {
                    text: {
                        actionPostbackError: 'action postback error'
                    }
                }
            }));
        });

        it('should post postback', () => {
            mockedStore.dispatch(conversationService.postPostback(actionId));
            coreMock.conversations.postPostback.should.have.been.calledWithMatch('1', actionId);
        });

        describe('errors', () => {
            beforeEach(() => {
                coreMock.conversations.postPostback.rejects();
            });

            it('should show an error notification', () => {
                return mockedStore.dispatch(conversationService.postPostback(actionId)).then(() => {
                    coreMock.conversations.postPostback.should.have.been.calledWithMatch('1', actionId);
                    showErrorNotificationSpy.should.have.been.calledWithMatch('action postback error');
                });
            });
        });
    });

    describe('fetchMoreMessages', () => {
        beforeEach(() => {
            coreMock.appUsers.getMessages.resolves({
                conversation: {},
                previous: '23'
            });
        });

        it('should use timestamp of first message as before parameter', () => {
            mockedStore = createMockedStore(sandbox, getProps({
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
            return mockedStore.dispatch(conversationService.fetchMoreMessages()).then(() => {
                coreMock.appUsers.getMessages.should.have.been.calledWithMatch('1', {
                    before: 123
                });
            });
        });

        it('should not fetch if there are no more messages', () => {
            mockedStore = createMockedStore(sandbox, getProps({
                conversation: {
                    hasMoreMessages: false,
                    isFetchingMoreMessagesFromServer: false,
                    messages: []
                }
            }));
            return mockedStore.dispatch(conversationService.fetchMoreMessages()).then(() => {
                coreMock.appUsers.getMessages.should.not.have.been.called;
            });
        });

        it('should not fetch if already fetching from server', () => {
            mockedStore = createMockedStore(sandbox, getProps({
                conversation: {
                    hasMoreMessages: true,
                    isFetchingMoreMessagesFromServer: true,
                    messages: []
                }
            }));
            return mockedStore.dispatch(conversationService.fetchMoreMessages()).then(() => {
                coreMock.appUsers.getMessages.should.not.have.been.called;
            });
        });
    });
});
