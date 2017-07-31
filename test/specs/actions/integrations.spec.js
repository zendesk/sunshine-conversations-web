import sinon from 'sinon';

import { createMock as createThrottleMock } from '../../mocks/throttle';
import { createMockedStore, generateBaseStoreProps } from '../../utils/redux';

import * as integrationsActions from '../../../src/frame/js/actions/integrations';
import { __Rewire__ as IntegrationsRewire } from '../../../src/frame/js/actions/integrations';
import { updateUser } from '../../../src/frame/js/actions/user';


describe('Integrations Actions', () => {
    let sandbox;

    let httpStub;
    let mockedStore;
    let updateUserSpy;
    let handleConversationUpdatedStub;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(() => {
        // Disable throttling for unit tests
        IntegrationsRewire('Throttle', createThrottleMock(sandbox));
        httpStub = sandbox.stub().returnsAsyncThunk();
        IntegrationsRewire('http', httpStub);
        updateUserSpy = sandbox.spy(updateUser);
        IntegrationsRewire('updateUser', updateUserSpy);
        handleConversationUpdatedStub = sandbox.stub().returnsAsyncThunk();
        IntegrationsRewire('handleConversationUpdated', handleConversationUpdatedStub);

        mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
            user: {
                _id: '1'
            }
        }));

    });

    afterEach(() => {
        sandbox.restore();
    });


    describe('linkSMSChannel', () => {
        beforeEach(() => {
            httpStub.returnsAsyncThunk({
                value: {
                    client: {}
                }
            });
        });

        it('should set the twilio integration to pending state', () => {
            const {config: {appId}, user: {_id}} = mockedStore.getState();
            return mockedStore.dispatch(integrationsActions.linkSMSChannel({
                type: 'twilio',
                phoneNumber: '+0123456789'
            })).then(() => {
                httpStub.should.have.been.calledWith('POST', `/client/apps/${appId}/appusers/${_id}/clients`, {
                    type: 'twilio',
                    phoneNumber: '+0123456789'
                });
            });
        });
    });

    describe('unlinkSMSChannel', () => {
        beforeEach(() => {
            mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                user: {
                    _id: '1',
                    clients: [
                        {
                            platform: 'twilio',
                            _id: 'twilio-client'
                        }
                    ],
                    pendingClients: []
                }
            }));
        });

        it('should set the sms integration state to unlinked', () => {
            const {config: {appId}, user: {_id}} = mockedStore.getState();
            return mockedStore.dispatch(integrationsActions.unlinkSMSChannel('twilio')).then(() => {
                httpStub.should.have.been.calledWith('DELETE', `/client/apps/${appId}/appusers/${_id}/clients/twilio-client`);
            });
        });
    });

    describe('pingSMSChannel', () => {
        beforeEach(() => {
            mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                user: {
                    _id: '1',
                    clients: [
                        {
                            platform: 'twilio',
                            _id: 'twilio-client'
                        }
                    ],
                    pendingClients: []
                }
            }));
        });

        it('should call the ping channel API', () => {
            const {config: {appId}, user: {_id}} = mockedStore.getState();
            return mockedStore.dispatch(integrationsActions.pingSMSChannel('twilio')).then(() => {
                httpStub.should.have.been.calledWith('POST', `/client/apps/${appId}/appusers/${_id}/clients/twilio-client/ping`);
            });
        });
    });

    describe('fetchTransferRequestCode', () => {
        beforeEach(() => {
            mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                config: {
                    integrations: [
                        {
                            type: 'messenger',
                            _id: 'messenger-integration'
                        }
                    ]
                }
            }));

            httpStub.returnsAsyncThunk({
                value: {
                    transferRequests: [{
                        code: '1234'
                    }]
                }
            });
        });

        it('should call the transferrequest API', () => {
            const channel = 'messenger';
            const {config: {appId}, user: {_id}} = mockedStore.getState();
            return mockedStore.dispatch(integrationsActions.fetchTransferRequestCode(channel)).then(() => {
                httpStub.should.have.been.calledWith('GET', `/client/apps/${appId}/appusers/${_id}/transferrequest`, {
                    type: channel,
                    integrationId: 'messenger-integration'
                });
            });
        });
    });
});
