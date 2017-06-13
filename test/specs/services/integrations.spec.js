import sinon from 'sinon';

import { createMock as createCoreMock } from '../../mocks/core';
import { createMock as createThrottleMock } from '../../mocks/throttle';
import { createMockedStore } from '../../utils/redux';

import * as integrationsService from '../../../src/frame/js/services/integrations';
import { __Rewire__ as IntegrationsRewire } from '../../../src/frame/js/services/integrations';
import { updateUser } from '../../../src/frame/js/actions/user-actions';

const sandbox = sinon.sandbox.create();

describe('Integrations service', () => {
    let coreMock;
    let mockedStore;
    let pendingAppUser;
    let updateUserSpy;
    let handleConversationUpdatedStub;

    beforeEach(() => {
        // Disable throttling for unit tests
        IntegrationsRewire('Throttle', createThrottleMock(sandbox));
        pendingAppUser = {
            appuser: {
                _id: '1',
                clients: [],
                pendingClients: [{
                    displayName: '+0123456789',
                    id: 'abcdefg',
                    platform: 'twilio',
                    linkedAt: '2016-07-28',
                    active: true
                }]
            }
        };

        coreMock = createCoreMock(sandbox);
        IntegrationsRewire('core', () => coreMock);
        coreMock.appUsers.linkChannel.resolves({
            appUser: pendingAppUser
        });
        coreMock.appUsers.unlinkChannel.resolves();
        coreMock.appUsers.pingChannel.resolves();
        coreMock.appUsers.getMessages.resolves({
            conversation: {
            },
            messages: []
        });
        coreMock.appUsers.transferRequest.resolves({
            transferRequests: [{
                code: '1234'
            }]
        });

        updateUserSpy = sandbox.spy(updateUser);
        IntegrationsRewire('updateUser', updateUserSpy);
        handleConversationUpdatedStub = sandbox.stub().returnsAsyncThunk();
        IntegrationsRewire('handleConversationUpdated', handleConversationUpdatedStub);

        mockedStore = createMockedStore(sandbox, {
            user: {
                _id: '1',
                clients: [],
                pendingClients: []
            },
            integrations: {
                twilio: {}
            },
            faye: {
                conversationSubscription: false
            },
            ui: {
                text: {}
            }
        });

    });

    afterEach(() => {
        sandbox.restore();
    });


    describe('linkTwilioChannel', () => {
        it('should set the twilio integration to pending state', () => {
            return mockedStore.dispatch(integrationsService.linkTwilioChannel('1', {
                type: 'twilio',
                phoneNumber: '+0123456789'
            })).then(() => {
                coreMock.appUsers.linkChannel.should.have.been.calledWith('1', {
                    type: 'twilio',
                    phoneNumber: '+0123456789'
                });
            });
        });

        it('should start faye if user returns with conversationStarted', () => {
            pendingAppUser.conversationStarted = true;

            return mockedStore.dispatch(integrationsService.linkTwilioChannel('1', {
                type: 'twilio',
                phoneNumber: '+0123456789'
            })).then(() => {
                handleConversationUpdatedStub.should.have.been.calledOnce;
            });
        });
    });

    describe('unlinkTwilioChannel', () => {
        it('should set the twilio integration state to unlinked', () => {
            return mockedStore.dispatch(integrationsService.unlinkTwilioChannel('1')).then(() => {
                coreMock.appUsers.unlinkChannel.should.have.been.calledWith('1', 'twilio');
            });
        });
    });

    describe('pingTwilioChannel', () => {
        it('should call the ping channel API', () => {
            return mockedStore.dispatch(integrationsService.pingTwilioChannel('1')).then(() => {
                coreMock.appUsers.pingChannel.should.have.been.calledWith('1', 'twilio');
            });
        });
    });

    describe('fetchTransferRequestCode', () => {
        it('should call the transferrequest API', () => {
            const channel = 'messenger';
            return mockedStore.dispatch(integrationsService.fetchTransferRequestCode(channel)).then(() => {
                coreMock.appUsers.transferRequest.should.have.been.calledWith('1', {
                    type: channel
                });
            });
        });
    });
});
