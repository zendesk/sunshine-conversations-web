import sinon from 'sinon';

import { createMockedStore, generateBaseStoreProps } from '../../utils/redux';
import { login, __Rewire__ as AuthRewire } from '../../../src/frame/js/actions/auth';

describe('Auth Actions', () => {
    let mockedStore;
    let sandbox;
    let httpStub;
    let getClientIdStub;
    let handleUserConversationResponseStub;
    let removeItemStub;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(() => {
        httpStub = sandbox.stub().returnsAsyncThunk({
            value: {
                response: {
                    status: 200
                }
            }
        });
        handleUserConversationResponseStub = sandbox.stub().returnsAsyncThunk();
        getClientIdStub = sandbox.stub().returns('some-client-id');
        removeItemStub = sandbox.stub();
        AuthRewire('http', httpStub);
        AuthRewire('handleUserConversationResponse', handleUserConversationResponseStub);
        AuthRewire('getClientId', getClientIdStub);
        AuthRewire('removeItem', removeItemStub);
        mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
            user: {
                userId: 'some-user-id'
            },
            auth: {
                sessionToken: 'some-session-token'
            }
        }));
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('login', () => {
        describe('user is known', () => {
            it('should call login api, remove the session token, and continue the flow', () => {
                return mockedStore.dispatch(login()).then(() => {
                    const {config: {appId}} = mockedStore.getState();
                    httpStub.should.have.been.calledWith('POST', `/apps/${mockedStore.getState().config.appId}/login`, {
                        userId: 'some-user-id',
                        clientId: 'some-client-id',
                        sessionToken: 'some-session-token'
                    });
                    handleUserConversationResponseStub.should.have.been.calledOnce;
                    removeItemStub.should.have.been.calledWith(`${appId}.sessionToken`);
                });
            });
        });

        describe('user is unknown', () => {
            beforeEach(() => {
                httpStub.returnsAsyncThunk({
                    value: {
                        response: {
                            status: 204
                        }
                    }
                });
            });
            it('should call login api, remove the session token, and stop', () => {
                return mockedStore.dispatch(login()).then(() => {
                    const {config: {appId}} = mockedStore.getState();
                    httpStub.should.have.been.calledWith('POST', `/apps/${mockedStore.getState().config.appId}/login`, {
                        userId: 'some-user-id',
                        clientId: 'some-client-id',
                        sessionToken: 'some-session-token'
                    });
                    handleUserConversationResponseStub.should.not.have.been.called;
                    removeItemStub.should.have.been.calledWith(`${appId}.sessionToken`);
                });
            });
        });


    });
});
