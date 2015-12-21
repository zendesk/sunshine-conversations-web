import sinon from 'sinon';
import rewrite from 'rewire';
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
        sandbox.stub(document.body, 'appendChild');
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
        });

        describe('conversation started', () => {
            const state = Object.assign({}, defaultState)
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
        const state = Object.assign({}, defaultState);

        beforeEach(() => {
            getConversationStub = sandbox.stub(conversationService, 'getConversation');
            getConversationStub.resolves({});

            connectFayeStub = sandbox.stub(conversationService, 'connectFaye');
            connectFayeStub.resolves({});

            mockedStore = mockStore(sandbox, state);
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
                    getConversationStub.should.have.been.calledOnce;
                    connectFayeStub.should.have.been.calledOnce;
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
                    getConversationStub.should.not.have.been.calledOnce;
                    connectFayeStub.should.not.have.been.calledOnce;
                });
            });
        });
    });

    describe('Send message', () => {

    });

    describe('Update user', () => {

    });

    describe('Logout', () => {

    });

    describe('Destroy', () => {

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
