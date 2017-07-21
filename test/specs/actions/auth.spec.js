import sinon from 'sinon';

import { createMockedStore, generateBaseStoreProps } from '../../utils/redux';
import { login, __Rewire__ as AuthRewire } from '../../../src/frame/js/actions/auth';

describe('Auth Actions', () => {
    let mockedStore;
    let sandbox;
    let httpStub;
    let getDeviceIdStub;
    let handleUserConversationResponseStub;

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
        getDeviceIdStub = sandbox.stub().returns('some-client-id');
        AuthRewire('http', httpStub);
        AuthRewire('handleUserConversationResponse', handleUserConversationResponseStub);
        AuthRewire('getDeviceId', getDeviceIdStub);
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
            it('should call login api and continue the flow', () => {
                return mockedStore.dispatch(login()).then(() => {
                    httpStub.should.have.been.calledWith('POST', `/apps/${mockedStore.getState().config.appId}/login`, {
                        userId: 'some-user-id',
                        clientId: 'some-client-id',
                        sessionToken: 'some-session-token'
                    });
                    handleUserConversationResponseStub.should.have.been.calledOnce;
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
            it('should call login api and stop', () => {
                return mockedStore.dispatch(login()).then(() => {
                    httpStub.should.have.been.calledWith('POST', `/apps/${mockedStore.getState().config.appId}/login`, {
                        userId: 'some-user-id',
                        clientId: 'some-client-id',
                        sessionToken: 'some-session-token'
                    });
                    handleUserConversationResponseStub.should.not.have.been.called;
                });
            });
        });


    });
});
