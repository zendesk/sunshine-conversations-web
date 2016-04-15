import sinon from 'sinon';
import { createMock } from 'test/mocks/core';
import { mockAppStore } from 'test/utils/redux';
import * as coreService from 'services/core';
import * as utilsFaye from 'utils/faye';
import * as utilsMedia from 'utils/media';
import * as userService from 'services/user-service';
import * as conversationService from 'services/conversation-service';
import { SHOW_SETTINGS_NOTIFICATION, SHOW_ERROR_NOTIFICATION } from 'actions/app-state-actions';


describe('Conversation service', () => {
    var sandbox;
    var coreMock;
    var mockedStore;
    var fayeSubscriptionMock;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        mockedStore.restore();
    });

    beforeEach(() => {
        coreMock = createMock(sandbox);
        coreMock.conversations.get.resolves({
            conversation: {
                messages: []
            }
        });

        sandbox.stub(coreService, 'core', () => {
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
        sandbox.stub(utilsMedia, 'isImageUploadSupported').returns(true);
        sandbox.stub(utilsMedia, 'isFileTypeSupported');
        sandbox.stub(utilsMedia, 'resizeImage');
        sandbox.stub(utilsMedia, 'getBlobFromDataUrl').returns('this-is-a-blob');
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('getConversation', () => {
        beforeEach(() => {
            mockedStore = mockAppStore(sandbox, {
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
                mockedStore = mockAppStore(sandbox, {
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
                mockedStore = mockAppStore(sandbox, {
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
                mockedStore = mockAppStore(sandbox, {
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
                mockedStore = mockAppStore(sandbox, {
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
                mockedStore = mockAppStore(sandbox, {
                    user: {
                        _id: '1',
                        conversationStarted: true
                    },
                    appState: {
                        settingsEnabled: true
                    },
                    conversation: {
                        messages: []
                    },
                    faye: {
                        subscription: fayeSubscriptionMock
                    }
                });

                coreMock.conversations.sendMessage.resolves({
                    conversation: 'conversation'
                });

                sandbox.stub(conversationService, 'handleFirstUserMessage');
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
                mockedStore = mockAppStore(sandbox, {
                    user: {
                        _id: '1',
                        conversationStarted: true
                    },
                    appState: {
                        settingsEnabled: true
                    },
                    conversation: {
                        messages: []
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
                mockedStore = mockAppStore(sandbox, {
                    user: {
                        _id: '1',
                        conversationStarted: false
                    },
                    appState: {
                        settingsEnabled: true
                    },
                    conversation: {
                        messages: []
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

            it('should set conversationStarted to true', () => {
                return conversationService.sendMessage('message').then(() => {
                    mockedStore.dispatch.should.have.been.calledWith({
                        type: 'UPDATE_USER',
                        properties: {
                            conversationStarted: true
                        }
                    });
                });
            });
        });
    });

    describe('uploadImage', () => {
        describe('conversation started and connected to faye', () => {
            beforeEach(() => {
                mockedStore = mockAppStore(sandbox, {
                    user: {
                        _id: '1',
                        conversationStarted: true
                    },
                    appState: {
                        settingsEnabled: true
                    },
                    conversation: {
                        messages: []
                    },
                    faye: {
                        subscription: fayeSubscriptionMock
                    }
                });

                coreMock.conversations.uploadImage.resolves({
                    conversation: 'conversation'
                });

                sandbox.stub(conversationService, 'handleFirstUserMessage');
                sandbox.stub(conversationService, 'connectFaye').resolves();
                utilsMedia.isFileTypeSupported.returns(true);
                utilsMedia.resizeImage.resolves({});
            });

            it('should not connect faye', () => {
                return conversationService.uploadImage({}).then(() => {
                    userService.immediateUpdate.should.have.been.calledOnce;

                    coreMock.conversations.uploadImage.should.have.been.calledWithMatch('1', 'this-is-a-blob', {
                        role: 'appUser'
                    });

                    utilsFaye.initFaye.should.not.have.been.called;
                });
            });
        });

        describe('conversation started and not connected to faye', () => {
            beforeEach(() => {
                mockedStore = mockAppStore(sandbox, {
                    user: {
                        _id: '1',
                        conversationStarted: true
                    },
                    appState: {
                        settingsEnabled: true
                    },
                    conversation: {
                        messages: []
                    },
                    faye: {
                        subscription: undefined
                    },
                    ui: {
                        text: {

                        }
                    }
                });

                sandbox.stub(conversationService, 'handleFirstUserMessage');
                sandbox.stub(conversationService, 'connectFaye').resolves();
                utilsMedia.isFileTypeSupported.returns(true);
                utilsMedia.resizeImage.resolves({});
            });

            it('should connect faye', () => {
                return conversationService.uploadImage({}).then(() => {
                    userService.immediateUpdate.should.have.been.calledOnce;

                    coreMock.conversations.uploadImage.should.have.been.calledWithMatch('1', 'this-is-a-blob', {
                        role: 'appUser'
                    });

                    utilsFaye.initFaye.should.have.been.calledOnce;
                });
            });
        });

        describe('conversation not started', () => {
            beforeEach(() => {
                mockedStore = mockAppStore(sandbox, {
                    user: {
                        _id: '1',
                        conversationStarted: true
                    },
                    appState: {
                        settingsEnabled: true
                    },
                    conversation: {
                        messages: []
                    },
                    faye: {
                        subscription: undefined
                    },
                    ui: {
                        text: {

                        }
                    }
                });

                sandbox.stub(conversationService, 'handleFirstUserMessage');
                sandbox.stub(conversationService, 'connectFaye').resolves();
                utilsMedia.isFileTypeSupported.returns(true);
                utilsMedia.resizeImage.resolves({});
            });

            it('should connect faye', () => {
                return conversationService.uploadImage({}).then(() => {
                    userService.immediateUpdate.should.have.been.calledOnce;

                    coreMock.conversations.uploadImage.should.have.been.calledWithMatch('1', 'this-is-a-blob', {
                        role: 'appUser'
                    });

                    utilsFaye.initFaye.should.have.been.calledOnce;
                });
            });
        });

        describe('errors', () => {
            beforeEach(() => {
                mockedStore = mockAppStore(sandbox, {
                    user: {
                        _id: '1',
                        conversationStarted: true
                    },
                    appState: {
                        settingsEnabled: true
                    },
                    conversation: {
                        messages: []
                    },
                    faye: {
                        subscription: fayeSubscriptionMock
                    },
                    ui: {
                        text: {
                            invalidFileError: 'invalidFileError'
                        }
                    }
                });

                sandbox.stub(conversationService, 'handleFirstUserMessage');
                sandbox.stub(conversationService, 'connectFaye').resolves();
            });

            describe('unsupported file type', () => {
                beforeEach(() => {
                    coreMock.conversations.uploadImage.resolves({
                        conversation: 'conversation'
                    });
                    utilsMedia.isFileTypeSupported.returns(false);
                    utilsMedia.resizeImage.resolves({});
                });

                it('should show an error notification', () => {
                    return conversationService.uploadImage({}).catch(() => {
                        mockedStore.dispatch.should.have.been.calledWith({
                            type: SHOW_ERROR_NOTIFICATION,
                            message: 'invalidFileError'
                        });
                    });
                });
            });

            describe('resize error', () => {
                beforeEach(() => {
                    coreMock.conversations.uploadImage.resolves({
                        conversation: 'conversation'
                    });
                    utilsMedia.isFileTypeSupported.returns(true);
                    utilsMedia.resizeImage.rejects();
                });

                it('should show an error notification', () => {
                    return conversationService.uploadImage({}).catch(() => {
                        mockedStore.dispatch.should.have.been.calledWith({
                            type: SHOW_ERROR_NOTIFICATION,
                            message: 'invalidFileError'
                        });
                    });
                });
            });

            describe('upload error', () => {
                beforeEach(() => {
                    utilsMedia.isFileTypeSupported.returns(true);
                    utilsMedia.resizeImage.resolves({});
                    coreMock.conversations.uploadImage.rejects();
                });

                it('should show an error notification', () => {
                    return conversationService.uploadImage({}).catch(() => {
                        mockedStore.dispatch.should.have.been.calledWith({
                            type: SHOW_ERROR_NOTIFICATION,
                            message: 'invalidFileError'
                        });
                    });
                });
            });
        });
    });


    function getScenarioName(scenario) {
        const messageType = scenario.state.conversation.messages.filter((message) => message.role === 'appUser').length === 1 ?
            'first appUser message' :
            'not first message';
        const settingsState = scenario.state.appState.settingsEnabled ? 'settings enabled' : 'settings disabled';
        const emailState = scenario.state.user.email ? 'email set' : 'email not set';

        // since the dispatch function is a no op, the last message in the state is assumed to be the last message dispatched
        const role = scenario.state.conversation.messages[scenario.state.conversation.messages.length - 1].role;
        const messageRole = `dispatching message with ${role} role`;

        return `${messageType}, ${settingsState}, ${emailState}, ${messageRole}`;
    }


    describe('handleFirstUserMessage', () => {
        let store;

        [{
            description: 'First message by appUser',
            state: {
                appState: {
                    settingsEnabled: true
                },
                user: {
                    email: undefined
                },
                conversation: {
                    messages: [
                        {
                            role: 'appUser'
                        }
                    ]
                }
            },
            outcome: true
        }, {
            description: 'Multiple messages by appUser',
            state: {
                appState: {
                    settingsEnabled: true
                },
                user: {
                    email: undefined
                },
                conversation: {
                    messages: [
                        {
                            role: 'appUser'
                        },
                        {
                            role: 'appUser'
                        }
                    ]
                }
            },
            outcome: false
        }, {
            description: 'Multiple messages by appMaker, but first by appUser',
            state: {
                appState: {
                    settingsEnabled: true
                },
                user: {
                    email: undefined
                },
                conversation: {
                    messages: [
                        {
                            role: 'appMaker'
                        },
                        {
                            role: 'appMaker'
                        },
                        {
                            role: 'appUser'
                        }
                    ]
                }
            },
            outcome: true
        }, {
            description: 'Email set',
            state: {
                appState: {
                    settingsEnabled: true
                },
                user: {
                    email: 'test@test.com'
                },
                conversation: {
                    messages: [
                        {
                            role: 'appUser'
                        }
                    ]
                }
            },
            outcome: false
        }, {
            description: 'First message by appMaker',
            state: {
                appState: {
                    settingsEnabled: true
                },
                user: {
                    email: undefined
                },
                conversation: {
                    messages: [
                        {
                            role: 'appMaker'
                        }
                    ]
                }
            },
            outcome: false
        }, {
            description: 'Settings disabled',
            state: {
                appState: {
                    settingsEnabled: false
                },
                user: {
                    email: undefined
                },
                conversation: {
                    messages: [
                        {
                            role: 'appUser'
                        }
                    ]
                }
            },
            outcome: false
        }].forEach((scenario) => {
            describe(`${scenario.description}: ${getScenarioName(scenario)}`, () => {
                beforeEach(() => {
                    store = mockAppStore(sandbox, Object.assign({}, scenario.state));
                });

                it(`should ${scenario.outcome ? '' : 'not'} call dispatch with showSettingsNotification`, () => {
                    conversationService.handleFirstUserMessage();
                    if (scenario.outcome) {
                        store.dispatch.should.have.been.calledWith({
                            type: SHOW_SETTINGS_NOTIFICATION
                        });
                    } else {
                        store.dispatch.should.not.have.been.called;
                    }
                });
            });
        });
    });
});
