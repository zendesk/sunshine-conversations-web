import sinon from 'sinon';
import hat from 'hat';

import { createMockedStore, generateBaseStoreProps } from '../../utils/redux';
import { login, logout, setAuth, resetAuth, __Rewire__ as AuthRewire } from '../../../src/frame/js/actions/auth';
import { setUser, resetUser } from '../../../src/frame/js/actions/user';
import { resetConversation } from '../../../src/frame/js/actions/conversation';
import { resetIntegrations } from '../../../src/frame/js/actions/integrations';

describe('Auth Actions', () => {
    let mockedStore;
    let sandbox;
    let httpStub;
    let getClientInfoStub;
    let getClientIdStub;
    let handleUserConversationResponseStub;
    let removeItemStub;
    let resetConversationSpy;
    let disconnectFayeStub;
    let immediateUpdateUserStub;
    let setUserSpy;
    let resetUserSpy;
    let resetAuthSpy;
    let setAuthSpy;
    let resetIntegrationsSpy;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(() => {
        httpStub = sandbox.stub().returnsAsyncThunk({
            value: {
                appUser: {}
            }
        });
        handleUserConversationResponseStub = sandbox.stub().returnsAsyncThunk();
        getClientInfoStub = sandbox.stub().returns({
            id: 'some-client-id'
        });
        getClientIdStub = sandbox.stub().returns('some-client-id');
        removeItemStub = sandbox.stub();
        AuthRewire('http', httpStub);
        AuthRewire('handleUserConversationResponse', handleUserConversationResponseStub);
        AuthRewire('getClientInfo', getClientInfoStub);
        AuthRewire('getClientId', getClientIdStub);
        AuthRewire('removeItem', removeItemStub);

        setUserSpy = sandbox.spy(setUser);
        AuthRewire('setUser', setUserSpy);

        resetIntegrationsSpy = sandbox.spy(resetIntegrations);
        AuthRewire('resetIntegrations', resetIntegrationsSpy);

        resetConversationSpy = sandbox.spy(resetConversation);
        AuthRewire('resetConversation', resetConversationSpy);

        disconnectFayeStub = sandbox.stub().returnsAsyncThunk();
        AuthRewire('disconnectFaye', disconnectFayeStub);

        immediateUpdateUserStub = sandbox.stub().returnsAsyncThunk();
        AuthRewire('immediateUpdateUser', immediateUpdateUserStub);

        resetUserSpy = sandbox.spy(resetUser);
        AuthRewire('resetUser', resetUserSpy);

        resetAuthSpy = sandbox.spy(resetAuth);
        AuthRewire('resetAuth', resetAuthSpy);

        setAuthSpy = sandbox.spy(setAuth);
        AuthRewire('setAuth', setAuthSpy);

        mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
            auth: {
                sessionToken: 'some-session-token'
            },
            user: {
                _id: 'some-appuser-id'
            }
        }));
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('login', () => {
        let jwt;
        let userId;

        beforeEach(() => {
            jwt = hat();
            userId = hat();
        });

        afterEach(() => {
            jwt = undefined;
            userId = undefined;
        });

        [true, false].forEach((isUserInitialized) => {
            describe(`user is ${isUserInitialized ? '': 'not '} initialized`, () => {
                beforeEach(() => {
                    mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                        auth: isUserInitialized ? {
                            sessionToken: 'some-session-token'
                        } : {},
                        user: isUserInitialized ? {
                            _id: 'some-appuser-id'
                        } : {}
                    }));
                });

                describe('user is known', () => {
                    it('should call login api, remove the session token, and continue the flow', () => {
                        return mockedStore.dispatch(login(userId, jwt))
                            .then(() => {
                                setAuthSpy.should.have.been.calledOnce;
                                setAuthSpy.should.have.been.calledWith({
                                    jwt
                                });

                                setUserSpy.should.have.been.calledOnce;
                                setUserSpy.should.have.been.calledWith({
                                    userId
                                });

                                resetConversationSpy.should.have.been.calledOnce;
                                disconnectFayeStub.should.have.been.calledOnce;
                                resetIntegrationsSpy.should.have.been.calledOnce;

                                if (isUserInitialized) {
                                    immediateUpdateUserStub.should.have.been.calledOnce;
                                } else {
                                    immediateUpdateUserStub.should.not.have.been.called;
                                }

                                const {config: {appId}} = mockedStore.getState();
                                httpStub.should.have.been.calledWith('POST', `/apps/${mockedStore.getState().config.appId}/login`, {
                                    userId,
                                    appUserId: isUserInitialized ? 'some-appuser-id' : undefined,
                                    client: {
                                        id: 'some-client-id'
                                    },
                                    sessionToken: isUserInitialized ? 'some-session-token' : undefined
                                });
                                handleUserConversationResponseStub.should.have.been.calledOnce;
                                removeItemStub.should.have.been.calledWith(`${appId}.sessionToken`);
                            });
                    });
                });

                describe('user is unknown', () => {
                    beforeEach(() => {
                        httpStub.returnsAsyncThunk({});
                    });

                    it('should call login api, remove the session token, and stop', () => {
                        return mockedStore.dispatch(login(userId, jwt))
                            .then(() => {
                                setAuthSpy.should.have.been.calledOnce;
                                setAuthSpy.should.have.been.calledWith({
                                    jwt
                                });

                                setUserSpy.should.have.been.calledOnce;
                                setUserSpy.should.have.been.calledWith({
                                    userId
                                });

                                resetConversationSpy.should.have.been.calledOnce;
                                disconnectFayeStub.should.have.been.calledOnce;
                                resetIntegrationsSpy.should.have.been.calledOnce;

                                if (isUserInitialized) {
                                    immediateUpdateUserStub.should.have.been.calledOnce;
                                } else {
                                    immediateUpdateUserStub.should.not.have.been.called;
                                }

                                const {config: {appId}} = mockedStore.getState();
                                httpStub.should.have.been.calledWith('POST', `/apps/${mockedStore.getState().config.appId}/login`, {
                                    userId,
                                    appUserId: isUserInitialized ? 'some-appuser-id' : undefined,
                                    client: {
                                        id: 'some-client-id'
                                    },
                                    sessionToken: isUserInitialized ? 'some-session-token' : undefined
                                });
                                handleUserConversationResponseStub.should.not.have.been.called;
                                removeItemStub.should.have.been.calledWith(`${appId}.sessionToken`);
                            });
                    });
                });
            });
        });
    });

    describe('logout', () => {
        let userId;
        let appUserId;

        beforeEach(() => {
            userId = hat();
            appUserId = hat();

            mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                user: {
                    userId,
                    _id: appUserId
                }
            }));
        });

        it('should abort if user is not logged in', () => {
            mockedStore = createMockedStore(sandbox, generateBaseStoreProps());

            return mockedStore.dispatch(logout())
                .then(() => {
                    httpStub.should.not.have.been.called;
                    resetAuthSpy.should.not.have.been.called;
                    resetUserSpy.should.not.have.been.called;
                    resetConversationSpy.should.not.have.been.called;
                    resetIntegrationsSpy.should.not.have.been.called;
                    disconnectFayeStub.should.not.have.been.called;
                    removeItemStub.should.not.have.been.called;
                });
        });

        it('should log out the user if there is an appUserId', () => {
            return mockedStore.dispatch(logout())
                .then(() => {
                    const {config: {appId}} = mockedStore.getState();

                    httpStub.should.have.been.calledOnce;
                    httpStub.should.have.been.calledWith('POST', `/apps/${appId}/appusers/${appUserId}/logout`, {
                        client: {
                            id: 'some-client-id'
                        }
                    });

                    resetAuthSpy.should.have.been.calledOnce;
                    resetUserSpy.should.have.been.calledOnce;
                    resetConversationSpy.should.have.been.calledOnce;
                    resetIntegrationsSpy.should.have.been.calledOnce;
                    disconnectFayeStub.should.have.been.calledOnce;

                    removeItemStub.should.have.been.calledTwice;
                    removeItemStub.should.have.been.calledWith(`${appId}.appUserId`);
                    removeItemStub.should.have.been.calledWith(`${appId}.sessionToken`);
                });
        });

        it('should reset the store if there is no appUserId', () => {
            mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                user: {
                    userId
                }
            }));

            return mockedStore.dispatch(logout())
                .then(() => {
                    const {config: {appId}} = mockedStore.getState();

                    httpStub.should.not.have.been.called;

                    resetAuthSpy.should.have.been.calledOnce;
                    resetUserSpy.should.have.been.calledOnce;
                    resetConversationSpy.should.have.been.calledOnce;
                    resetIntegrationsSpy.should.have.been.calledOnce;
                    disconnectFayeStub.should.have.been.calledOnce;

                    removeItemStub.should.have.been.calledTwice;
                    removeItemStub.should.have.been.calledWith(`${appId}.appUserId`);
                    removeItemStub.should.have.been.calledWith(`${appId}.sessionToken`);
                });
        });
    });
});
