import sinon from 'sinon';
import { Smooch } from 'smooch.jsx';
import * as authService from 'services/auth-service';
import * as conversationService from 'services/conversation-service';
import * as userService from 'services/user-service';
import { mockAppStore } from 'test/utils/redux';

const defaultState = {
    user: {
        conversationStarted: true
    },
    conversation: {
        messages: []
    },
    appState: {
        serverUrl: 'http://localhost'
    },
    auth: {
        jwt: '1234'
    },
    faye: {
        subscription: true
    },
    ui: {
        text: {

        }
    },
    app: {}
};

describe('Smooch', () => {
    const sandbox = sinon.sandbox.create();
    let smooch;

    let loginStub;
    let sendMessageStub;
    let connectFayeStub;
    let disconnectFayeStub;
    let updateUserStub;
    let trackEventStub;
    let mockedStore;

    after(() => {
        mockedStore && mockedStore.restore();
    });

    beforeEach(() => {
        smooch = new Smooch();
        smooch._container = '_container';
        sandbox.stub(document.body, 'appendChild');
        sandbox.stub(document.body, 'removeChild');
        sandbox.stub(document, 'addEventListener', (eventName, cb) => {
            if (eventName === 'DOMContentLoaded') {
                cb();
            }
        });
    });

    afterEach(() => {
        sandbox.restore();
        delete smooch.appToken;
    });

    describe('Init', () => {
        const state = Object.assign({}, defaultState);

        beforeEach(() => {
            loginStub = sandbox.stub(smooch, 'login');
            mockedStore = mockAppStore(sandbox, state);
        });

        it('should call login', () => {
            const props = {
                userId: 'some-id',
                appToken: 'some-token',
                jwt: 'some-jwt',
                email: 'some@email.com'
            };

            smooch.init(props);

            smooch.appToken.should.eq(props.appToken);
            loginStub.should.have.been.calledWith(props.userId, props.jwt, {
                email: 'some@email.com'
            });
        });

    });

    describe('Login', () => {
        let loginStub;
        let getConversationStub;
        let immediateUpdateStub;

        beforeEach(() => {
            mockedStore = mockAppStore(sandbox, defaultState);
            loginStub = sandbox.stub(authService, 'login');
            loginStub.resolves({
                appUser: {
                    _id: 1
                },
                app: {}
            });

            immediateUpdateStub = sandbox.stub(userService, 'immediateUpdate');
            immediateUpdateStub.resolves({});

            getConversationStub = sandbox.stub(conversationService, 'getConversation');
            getConversationStub.resolves({});

            connectFayeStub = sandbox.stub(conversationService, 'connectFaye');
            connectFayeStub.resolves({});

            disconnectFayeStub = sandbox.stub(conversationService, 'disconnectFaye');
        });

        it('should reset the user', () => {
            const props = {
                userId: 'some-id',
                appToken: 'some-token',
                jwt: 'some-jwt',
                email: 'some@email.com'
            };

            return smooch.login(props.userId, props.jwt).then(() => {
                mockedStore.dispatch.firstCall.should.have.been.calledWith({
                    type: 'RESET_AUTH'
                });

                mockedStore.dispatch.secondCall.should.have.been.calledWith({
                    type: 'RESET_USER'
                });


                mockedStore.dispatch.thirdCall.should.have.been.calledWith({
                    type: 'RESET_CONVERSATION'
                });

                disconnectFayeStub.should.have.been.calledOnce;
            });
        });

        describe('conversation started', () => {
            const state = Object.assign({}, defaultState);
            beforeEach(() => {
                mockedStore = mockAppStore(sandbox, state);
            });

            it('should call the auth service, get the conversation and not connect to faye', () => {
                const props = {
                    userId: 'some-id',
                    appToken: 'some-token',
                    jwt: 'some-jwt',
                    email: 'some@email.com'
                };

                return smooch.login(props.userId, props.jwt).then(() => {
                    const callArgs = loginStub.args[0][0];
                    callArgs.userId.should.eq(props.userId);
                    immediateUpdateStub.should.have.been.calledWith, {
                        email: 'some@email.com'
                    };
                    getConversationStub.should.have.been.calledOnce;
                    connectFayeStub.should.have.been.calledOnce;
                });
            });
        });

        describe('conversation not started', () => {
            const state = Object.assign({}, defaultState, {
                user: {
                    conversationStarted: false
                }
            });

            beforeEach(() => {
                mockedStore = mockAppStore(sandbox, state);
            });

            it('should call the auth service, get the conversation and not connect to faye', () => {
                const props = {
                    userId: 'some-id',
                    appToken: 'some-token',
                    jwt: 'some-jwt',
                    email: 'some@email.com'
                };

                return smooch.login(props.userId, props.jwt).then(() => {
                    const callArgs = loginStub.args[0][0];
                    callArgs.userId.should.eq(props.userId);

                    immediateUpdateStub.should.have.been.calledWith, {
                        email: 'some@email.com'
                    };
                    getConversationStub.should.not.have.been.called;
                    connectFayeStub.should.not.have.been.called;
                });
            });
        });
    });

    describe('Track event', () => {
        beforeEach(() => {
            mockedStore = mockAppStore(sandbox, defaultState);
            trackEventStub = sandbox.stub(userService, 'trackEvent');
            trackEventStub.resolves({
                conversationUpdated: true
            });
        });


        it('should call trackEvent', () => {
            const props = {
                email: 'some@email.com'
            };

            return smooch.track('some-event', props).then(() => {
                trackEventStub.should.have.been.calledWith('some-event', props);
            });
        });
    });

    describe('Send message', () => {
        beforeEach(() => {
            mockedStore = mockAppStore(sandbox, defaultState);

            sendMessageStub = sandbox.stub(conversationService, 'sendMessage');
            sendMessageStub.resolves({});
        });

        it('should call the conversation service', () => {
            return smooch.sendMessage('here is my message').then(() => {
                sendMessageStub.should.have.been.calledWith('here is my message');
            });
        });

    });

    describe('Get conversation', () => {
        beforeEach(() => {
            mockedStore = mockAppStore(sandbox, defaultState);
            sandbox.stub(conversationService, 'handleConversationUpdated');
        });

        describe('conversation exists', () => {
            beforeEach(() => {
                conversationService.handleConversationUpdated.resolves({});
            });

            it('should call handleConversationUpdated', () => {
                return smooch.getConversation().then(() => {
                    conversationService.handleConversationUpdated.should.have.been.calledOnce;
                });
            });

            it('should resolve conversation object', () => {
                return smooch.getConversation().then((conversation) => {
                    if (!conversation.messages) {
                        return Promise.reject(new Error('Conversation not found'));
                    }
                });
            });

            it('should update conversationStarted to true ', () => {
                return smooch.getConversation().then(() => {
                    mockedStore.dispatch.should.have.been.calledWith({
                        type: 'UPDATE_USER',
                        properties: {
                            conversationStarted: true
                        }
                    });
                });
            });
        });

        describe('conversation does not exist', () => {
            beforeEach(() => {
                conversationService.handleConversationUpdated.rejects();
            });

            it('should reject', (done) => {
                return smooch.getConversation()
                    .catch(() => done())
                    .then(() => done(new Error('Promise should not have resolved')));
            });

            it('should not update conversationStarted to true ', () => {
                return smooch.getConversation().catch(() => {
                    mockedStore.dispatch.should.not.have.been.calledWith({
                        type: 'UPDATE_USER',
                        properties: {
                            conversationStarted: true
                        }
                    });
                });
            });
        });

    });

    describe('Update user', () => {
        beforeEach(() => {
            mockedStore = mockAppStore(sandbox, defaultState);

            updateUserStub = sandbox.stub(userService, 'update');

            sandbox.stub(conversationService, 'handleConversationUpdated');
            conversationService.handleConversationUpdated.resolves({});
        });

        describe('conversation started', () => {
            beforeEach(() => {
                updateUserStub.resolves({
                    appUser: {
                        conversationStarted: true
                    }
                });
            });

            it('should call handleConversationUpdated', () => {
                return smooch.updateUser({
                    email: 'update@me.com'
                }).then(() => {
                    updateUserStub.should.have.been.calledWith({
                        email: 'update@me.com'
                    });

                    conversationService.handleConversationUpdated.should.have.been.calledOnce;
                });
            });
        });

        describe('conversation not started', () => {
            beforeEach(() => {
                updateUserStub.resolves({
                    appUser: {
                        conversationStarted: false
                    }
                });
            });

            it('should not handleConversationUpdated', () => {
                return smooch.updateUser({
                    email: 'update@me.com'
                }).then(() => {
                    updateUserStub.should.have.been.calledWith({
                        email: 'update@me.com'
                    });

                    conversationService.handleConversationUpdated.should.not.have.been.calledOnce;
                });
            });
        });
    });

    describe('Logout', () => {
        beforeEach(() => {
            loginStub = sandbox.stub(smooch, 'login');
        });

        it('should call login', () => {
            smooch.logout();
            loginStub.should.have.been.called;
        });
    });

    describe('Destroy', () => {
        beforeEach(() => {
            mockedStore = mockAppStore(sandbox, defaultState);
            disconnectFayeStub = sandbox.stub(conversationService, 'disconnectFaye');
        });

        it('should reset store state and remove the container', () => {
            smooch.destroy();
            mockedStore.dispatch.should.have.been.calledWith({
                type: 'RESET'
            });

            document.body.removeChild.should.have.been.calledOnce;
        });

        it('should not remove the container from body if it is undefined', () => {
            delete smooch._container;
            smooch.destroy();
            mockedStore.dispatch.should.have.been.calledWith({
                type: 'RESET'
            });

            document.body.removeChild.should.not.have.been.calledOnce;
        });
    });

    describe('Open', () => {
        describe('normal', () => {
            beforeEach(() => {
                mockedStore = mockAppStore(sandbox, defaultState);
            });

            it('should dispatch', () => {
                smooch.open();
                mockedStore.dispatch.should.have.been.calledWith({
                    type: 'OPEN_WIDGET'
                });
            });
        });

        describe('embedded', () => {
            beforeEach(() => {
                const state = Object.assign({}, defaultState, {
                    appState: Object.assign({}, defaultState.appState, {
                        embedded: true
                    })
                });
                mockedStore = mockAppStore(sandbox, state);
            });

            it('should dispatch', () => {
                smooch.open();
                mockedStore.dispatch.should.not.have.been.called;
            });
        });
    });

    describe('Close', () => {
        describe('normal', () => {
            beforeEach(() => {
                mockedStore = mockAppStore(sandbox, defaultState);
            });

            it('should not dispatch', () => {
                smooch.close();
                mockedStore.dispatch.should.have.been.calledWith({
                    type: 'CLOSE_WIDGET'
                });
            });
        });

        describe('embedded', () => {
            beforeEach(() => {
                const state = Object.assign({}, defaultState, {
                    appState: Object.assign({}, defaultState.appState, {
                        embedded: true
                    })
                });
                mockedStore = mockAppStore(sandbox, state);
            });

            it('should not dispatch', () => {
                smooch.close();
                mockedStore.dispatch.should.not.have.been.called;
            });
        });
    });
});
