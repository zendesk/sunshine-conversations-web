import sinon from 'sinon';
import { Smooch } from 'smooch.jsx';
import * as authService from 'services/auth-service';
import * as conversationService from 'services/conversation-service';
import * as userService from 'services/user-service';
import { getMockedStore } from 'test/utils/redux';

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
    }
};

describe('Smooch', () => {
    const sandbox = sinon.sandbox.create();
    var smooch;

    var appendChildStub;

    var loginStub;
    var getConversationStub;
    var sendMessageStub;
    var connectFayeStub;
    var disconnectFayeStub;
    var resetConversationStub;
    var resetUserStub;
    var resetAuthStub;
    var updateUserStub;
    var immediateUpdateUserStub;
    var trackEventStub;
    var mockedStore;

    after(() => {
        Object.defineProperty(AppStore, 'store', {
            get: () => {
                return store;
            }
        });
    });

    beforeEach(() => {
        smooch = new Smooch();
        smooch._el = 'el';
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
            mockedStore = mockStore(sandbox, state);
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
        var loginStub;
        var getConversationStub;
        var immediateUpdateStub;

        beforeEach(() => {
            mockedStore = mockStore(sandbox, defaultState);
            loginStub = sandbox.stub(authService, 'login');
            loginStub.resolves({
                appUser: {
                    _id: 1
                }
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
                mockedStore = mockStore(sandbox, state);
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
                mockedStore = mockStore(sandbox, state);
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
            mockedStore = mockStore(sandbox, defaultState);
        });

        describe('conversation updated', () => {
            beforeEach(() => {
                trackEventStub = sandbox.stub(userService, 'trackEvent');
                trackEventStub.resolves({
                    conversationUpdated: true
                });
            });


            it('should call trackEvent and connectFaye', () => {
                const props = {
                    email: 'some@email.com'
                };

                return smooch.track('some-event', props).then(() => {
                    trackEventStub.should.have.been.calledWith('some-event', props);
                });
            });
        });

        describe('conversation not updated', () => {
            beforeEach(() => {
                trackEventStub = sandbox.stub(userService, 'trackEvent');
                trackEventStub.resolves({
                    conversationUpdated: false
                });
            });


            it('should call trackEvent and connectFaye', () => {
                const props = {
                    email: 'some@email.com'
                };

                return smooch.track('some-event', props).then(() => {
                    trackEventStub.should.have.been.calledWith('some-event', props);
                });
            });
        });
    });

    describe('Send message', () => {
        beforeEach(() => {
            mockedStore = mockStore(sandbox, defaultState);

            sendMessageStub = sandbox.stub(conversationService, 'sendMessage');
            sendMessageStub.resolves({});
        });

        it('should call the conversation service', () => {
            return smooch.sendMessage('here is my message').then(() => {
                sendMessageStub.should.have.been.calledWith('here is my message');
            });
        });

    });

    describe('Update user', () => {
        beforeEach(() => {
            mockedStore = mockStore(sandbox, defaultState);

            updateUserStub = sandbox.stub(userService, 'update');

            getConversationStub = sandbox.stub(conversationService, 'getConversation');
            getConversationStub.resolves({});

            connectFayeStub = sandbox.stub(conversationService, 'connectFaye');
            connectFayeStub.resolves({});
        });

        describe('conversation started', () => {
            beforeEach(() => {
                updateUserStub.resolves({
                    appUser: {
                        conversationStarted: true
                    }
                });
            });

            it('should get the conversation and connect faye', () => {
                return smooch.updateUser({
                    email: 'update@me.com'
                }).then(() => {
                    updateUserStub.should.have.been.calledWith({
                        email: 'update@me.com'
                    });

                    getConversationStub.should.have.been.calledOnce;
                    connectFayeStub.should.have.been.calledOnce;
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

            it('should not get the conversation and connect faye', () => {
                return smooch.updateUser({
                    email: 'update@me.com'
                }).then(() => {
                    updateUserStub.should.have.been.calledWith({
                        email: 'update@me.com'
                    });

                    getConversationStub.should.not.have.been.calledOnce;
                    connectFayeStub.should.not.have.been.calledOnce;
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
            mockedStore = mockStore(sandbox, defaultState);
            disconnectFayeStub = sandbox.stub(conversationService, 'disconnectFaye');
        });

        it('should reset store state and remove el', () => {
            smooch.destroy();
            mockedStore.dispatch.should.have.been.calledWith({
                type: 'RESET'
            });

            document.body.removeChild.should.have.been.calledOnce;
        });
    });

    describe('Open', () => {
        beforeEach(() => {
            mockedStore = mockStore(sandbox, defaultState);
        });

        it('should dispatch', () => {
            smooch.open();
            mockedStore.dispatch.should.have.been.calledWith({
                type: 'OPEN_WIDGET'
            });
        });
    });

    describe('Close', () => {
        beforeEach(() => {
            mockedStore = mockStore(sandbox, defaultState);
        });

        it('should dispatch', () => {
            smooch.close();
            mockedStore.dispatch.should.have.been.calledWith({
                type: 'CLOSE_WIDGET'
            });
        });
    });
});
