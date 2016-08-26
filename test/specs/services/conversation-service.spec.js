import sinon from 'sinon';

import { createMock } from '../../mocks/core';
import { mockAppStore } from '../../utils/redux';

import * as utilsDevice from '../../../src/js/utils/device';
import * as utilsFaye from '../../../src/js/utils/faye';
import * as utilsMedia from '../../../src/js/utils/media';
import * as utilsUser from '../../../src/js/utils/user';
import * as conversationService from '../../../src/js/services/conversation-service';
import * as coreService from '../../../src/js/services/core';
import * as userService from '../../../src/js/services/user-service';
import * as appService from '../../../src/js/services/app-service';
import * as appStateActions from '../../../src/js/actions/app-state-actions';
import * as conversationActions from '../../../src/js/actions/conversation-actions';
import * as userActions from '../../../src/js/actions/user-actions';
import * as fayeActions from '../../../src/js/actions/faye-actions';

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
        }
    };

    return Object.assign({}, defaultProps, props);
}

describe('Conversation service', () => {
    var sandbox;
    var coreMock;
    var mockedStore;
    var fayeSubscriptionMock;
    var userSubscriptionMock;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        mockedStore.restore();
    });

    beforeEach(() => {
        coreMock = createMock(sandbox);
        coreMock.appUsers.getMessages.resolves({
            conversation: {
            },
            messages: []
        });

        sandbox.stub(coreService, 'core', () => {
            return coreMock;
        });

        fayeSubscriptionMock = {
            cancel: sandbox.stub().resolves()
        };

        userSubscriptionMock = {
            cancel: sandbox.stub().resolves()
        };

        sandbox.stub(utilsFaye, 'disconnectClient').returns(null);
        sandbox.stub(utilsFaye, 'subscribeConversation').resolves();
        sandbox.stub(utilsFaye, 'subscribeUser').resolves();
        sandbox.stub(utilsMedia, 'isImageUploadSupported').returns(true);
        sandbox.stub(utilsMedia, 'isFileTypeSupported');
        sandbox.stub(utilsMedia, 'resizeImage');
        sandbox.stub(utilsMedia, 'getBlobFromDataUrl').returns('this-is-a-blob');
        sandbox.stub(utilsDevice, 'getDeviceId').returns('1234');
        sandbox.stub(utilsUser, 'hasLinkableChannels').returns(true);
        sandbox.stub(utilsUser, 'isChannelLinked').returns(false);

        sandbox.stub(appService, 'showConnectNotification');
        sandbox.stub(userService, 'immediateUpdate').resolves();

        sandbox.stub(conversationActions, 'setConversation');
        sandbox.stub(conversationActions, 'replaceMessage');
        sandbox.stub(conversationActions, 'addMessage');
        sandbox.stub(conversationActions, 'removeMessage');
        sandbox.stub(conversationActions, 'resetUnreadCount');
        sandbox.stub(userActions, 'updateUser');
        sandbox.stub(appStateActions, 'showErrorNotification');
        sandbox.stub(fayeActions, 'unsetFayeSubscriptions');
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('handleConnectNotification', () => {
        it('should show connect notification on first appuser message', () => {
            mockedStore = mockAppStore(sandbox, getProps({
                conversation: {
                    messages: [
                        {
                            received: 1,
                            role: 'appUser'
                        }
                    ]
                }
            }));

            conversationService.handleConnectNotification({});
            appService.showConnectNotification.should.have.been.calledOnce;
        });

        it('should show connect notification 24 hours later', () => {
            mockedStore = mockAppStore(sandbox, getProps({
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

            conversationService.handleConnectNotification({});
            appService.showConnectNotification.should.have.been.calledOnce;

        });

        it('should not show connect notification if it\'s been less than 24 hours', () => {
            mockedStore = mockAppStore(sandbox, getProps({
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

            conversationService.handleConnectNotification({});
            appService.showConnectNotification.should.not.have.been.called;
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

        describe('conversation started', () => {
            beforeEach(() => {
                mockedStore = mockAppStore(sandbox, getProps({
                    user: {
                        _id: '1',
                        conversationStarted: true
                    }
                }));
            });

            it('should replace message', () => {
                return conversationService.sendMessage('message').then(() => {
                    userService.immediateUpdate.should.have.been.calledOnce;

                    coreMock.appUsers.sendMessage.should.have.been.calledWithMatch('1', {
                        text: 'message',
                        role: 'appUser'
                    });

                    conversationActions.addMessage.should.have.been.called;
                    conversationActions.setConversation.should.not.have.been.called;
                    conversationActions.replaceMessage.should.have.been.called;
                    userActions.updateUser.should.not.have.been.called;
                });
            });
        });

        describe('conversation not started', () => {
            beforeEach(() => {
                mockedStore = mockAppStore(sandbox, getProps({
                    user: {
                        _id: '1',
                        conversationStated: false
                    }
                }));
            });

            it('should set conversation to started', () => {
                return conversationService.sendMessage('message').then(() => {
                    userService.immediateUpdate.should.have.been.calledOnce;

                    coreMock.appUsers.sendMessage.should.have.been.calledWithMatch('1', {
                        text: 'message',
                        role: 'appUser'
                    });

                    conversationActions.addMessage.should.have.been.called;
                    conversationActions.setConversation.should.have.been.called;
                    conversationActions.replaceMessage.should.have.been.called;
                    userActions.updateUser.should.have.been.called;
                });
            });
        });

        describe('errors', () => {
            it('should show an error notification', () => {
                mockedStore = mockAppStore(sandbox, getProps());
                return conversationService.sendMessage('message').catch(() => {
                    appStateActions.showErrorNotification.should.have.been.called;
                    conversationActions.removeMessage.should.have.been.called;
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
        });

        describe('conversation started', () => {
            beforeEach(() => {
                mockedStore = mockAppStore(sandbox, getProps({
                    user: {
                        _id: '1',
                        conversationStarted: true
                    }
                }));
                utilsMedia.isFileTypeSupported.returns(true);
                utilsMedia.resizeImage.resolves({});
            });

            it('should replace image', () => {
                return conversationService.uploadImage({}).then(() => {
                    userService.immediateUpdate.should.have.been.calledOnce;

                    coreMock.appUsers.uploadImage.should.have.been.calledWithMatch('1', 'this-is-a-blob', {
                        role: 'appUser',
                        deviceId: '1234'
                    });

                    conversationActions.setConversation.should.not.have.been.called;
                    conversationActions.replaceMessage.should.have.been.called;
                    userActions.updateUser.should.not.have.been.called;
                });
            });
        });

        describe('conversation not started', () => {
            beforeEach(() => {
                mockedStore = mockAppStore(sandbox, getProps({
                    user: {
                        _id: '1',
                        conversationStarted: false
                    }
                }));
                utilsMedia.isFileTypeSupported.returns(true);
                utilsMedia.resizeImage.resolves({});
            });

            it('should set conversation to started', () => {
                return conversationService.uploadImage({}).then(() => {
                    userService.immediateUpdate.should.have.been.calledOnce;

                    coreMock.appUsers.uploadImage.should.have.been.calledWithMatch('1', 'this-is-a-blob', {
                        role: 'appUser'
                    });

                    conversationActions.setConversation.should.have.been.called;
                    conversationActions.replaceMessage.should.have.been.called;
                    userActions.updateUser.should.have.been.called;
                });
            });
        });

        describe('errors', () => {
            beforeEach(() => {
                mockedStore = mockAppStore(sandbox, getProps({
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
                    coreMock.appUsers.uploadImage.resolves({
                        conversation: 'conversation'
                    });
                    utilsMedia.isFileTypeSupported.returns(false);
                    utilsMedia.resizeImage.resolves({});
                });

                it('should show an error notification', () => {
                    return conversationService.uploadImage({}).catch(() => {
                        appStateActions.showErrorNotification.should.have.been.called;
                    });
                });
            });

            describe('resize error', () => {
                beforeEach(() => {
                    coreMock.appUsers.uploadImage.resolves({
                        conversation: 'conversation'
                    });
                    utilsMedia.isFileTypeSupported.returns(true);
                    utilsMedia.resizeImage.rejects();
                });

                it('should show an error notification', () => {
                    return conversationService.uploadImage({}).catch(() => {
                        appStateActions.showErrorNotification.should.have.been.called;
                    });
                });
            });

            describe('upload error', () => {
                beforeEach(() => {
                    utilsMedia.isFileTypeSupported.returns(true);
                    utilsMedia.resizeImage.resolves({});
                    coreMock.appUsers.uploadImage.rejects();
                });

                it('should show an error notification', () => {
                    return conversationService.uploadImage({}).catch(() => {
                        appStateActions.showErrorNotification.should.have.been.called;
                        conversationActions.removeMessage.should.have.been.called;
                    });
                });
            });
        });
    });

    describe('getMessages', () => {
        beforeEach(() => {
            mockedStore = mockAppStore(sandbox, {
                user: {
                    _id: '1'
                }
            });
        });

        it('should call smooch-core conversation api and dispatch conversation', () => {
            return conversationService.getMessages().then((response) => {
                coreMock.appUsers.getMessages.should.have.been.calledWith('1');

                response.should.deep.eq({
                    conversation: {
                    },
                    messages: []
                });

                conversationActions.setConversation.should.have.been.called;
            });
        });
    });

    describe('connectFayeConversation', () => {
        [true, false].forEach((active) => {
            describe(`with${active ? '' : 'out'} subscription active`, () => {
                it(`should ${active ? 'not' : ''} subscribe to conversation`, () => {
                    mockedStore = active ? mockAppStore(sandbox, getProps({
                        faye: {
                            conversationSubscription: fayeSubscriptionMock
                        }
                    })) : mockAppStore(sandbox, getProps());

                    return conversationService.connectFayeConversation().then(() => {
                        if (active) {
                            utilsFaye.subscribeConversation.should.not.have.been.called;
                        } else {
                            utilsFaye.subscribeConversation.should.have.been.calledOnce;
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
                    mockedStore = subscribed ? mockAppStore(sandbox, getProps({
                        faye: {
                            userSubscription: userSubscriptionMock
                        }
                    })) : mockAppStore(sandbox, getProps());

                    return conversationService.connectFayeUser().then(() => {
                        if (subscribed) {
                            utilsFaye.subscribeUser.should.have.not.been.called;
                        } else {
                            utilsFaye.subscribeUser.should.have.been.calledOnce;
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
                    mockedStore = active ? mockAppStore(sandbox, getProps({
                        faye: {
                            conversationSubscription: fayeSubscriptionMock
                        }
                    })) : mockAppStore(sandbox, getProps());
                    conversationService.disconnectFaye();

                    userSubscriptionMock.cancel.should.not.have.been.called;
                    utilsFaye.disconnectClient.should.have.been.called;
                    fayeActions.unsetFayeSubscriptions.should.have.been.called;
                    if (active) {
                        fayeSubscriptionMock.cancel.should.have.been.called;
                    } else {
                        fayeSubscriptionMock.cancel.should.not.have.been.called;
                    }
                });
            });
        });

        [true, false].forEach((subscribed) => {
            describe(`user ${subscribed ? '' : 'not'} subscribed`, () => {
                it(`should ${subscribed ? '' : 'not'} cancel their subscription`, () => {
                    mockedStore = subscribed ? mockAppStore(sandbox, getProps({
                        faye: {
                            userSubscription: userSubscriptionMock
                        }
                    })) : mockAppStore(sandbox, getProps());
                    conversationService.disconnectFaye();

                    fayeSubscriptionMock.cancel.should.not.have.been.called;
                    utilsFaye.disconnectClient.should.have.been.called;
                    fayeActions.unsetFayeSubscriptions.should.have.been.called;
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
            mockedStore = mockAppStore(sandbox, getProps({
                user: {
                    _id: '1'
                },
                conversation: {
                    unreadCount: 20
                }
            }));
            conversationService.resetUnreadCount();
            coreMock.conversations.resetUnreadCount.should.have.been.calledWithMatch('1');
        });
    });

    describe('handleConversationUpdated', () => {
        [true, false].forEach((active) => {
            describe(`with${active ? '' : 'out'} subscription active`, () => {
                it(`should ${active ? 'not' : ''} get conversation`, () => {
                    mockedStore = active ? mockAppStore(sandbox, getProps({
                        user: {
                            _id: '1'
                        },
                        faye: {
                            conversationSubscription: fayeSubscriptionMock
                        }
                    })) : mockAppStore(sandbox, getProps());

                    return conversationService.handleConversationUpdated().then(() => {
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
            mockedStore = mockAppStore(sandbox, getProps({
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
            conversationService.postPostback(actionId);
            coreMock.conversations.postPostback.should.have.been.calledWithMatch('1', actionId);
        });

        it('should show error notification on error', () => {
            return conversationService.postPostback(actionId).catch(() => {
                coreMock.conversations.postPostback.should.have.been.calledWithMatch('1', actionId);
                appStateActions.showErrorNotification.should.have.been.calledWithMatch('action postback error');
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
            mockedStore = mockAppStore(sandbox, getProps({
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
            return conversationService.fetchMoreMessages().then(() => {
                coreMock.appUsers.getMessages.should.have.been.calledWithMatch('1', {
                    before: 123
                });
            });
        });

        it('should not fetch if there are no more messages', () => {
            mockedStore = mockAppStore(sandbox, getProps({
                conversation: {
                    hasMoreMessages: false,
                    isFetchingMoreMessagesFromServer: false,
                    messages: []
                }
            }));
            return conversationService.fetchMoreMessages().then(() => {
                coreMock.appUsers.getMessages.should.not.have.been.called;
            });
        });

        it('should not fetch if already fetching from server', () => {
            mockedStore = mockAppStore(sandbox, getProps({
                conversation: {
                    hasMoreMessages: true,
                    isFetchingMoreMessagesFromServer: true,
                    messages: []
                }
            }));
            return conversationService.fetchMoreMessages().then(() => {
                coreMock.appUsers.getMessages.should.not.have.been.called;
            });
        });
    });
});
