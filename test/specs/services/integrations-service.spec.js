import sinon from 'sinon';

import { createMock } from '../../mocks/core';
import { mockAppStore } from '../../utils/redux';

import * as coreService from '../../../src/js/services/core';
import * as integrationsService from '../../../src/js/services/integrations-service';

const sandbox = sinon.sandbox.create();

describe('Integrations service', () => {
    let coreMock;
    let mockedStore;

    beforeEach(() => {

        const pendingAppUser = {
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

        coreMock = createMock(sandbox);
        coreMock.appUsers.linkChannel.resolves(pendingAppUser);
        coreMock.appUsers.unlinkChannel.resolves();
        coreMock.appUsers.pingChannel.resolves();
        sandbox.stub(coreService, 'core', () => {
            return coreMock;
        });

        mockedStore = mockAppStore(sandbox, {
            user: {
                _id: '1',
                clients: [],
                pendingClients: []
            },
            integrations: {
                twilio: {}
            }
        });
    });

    afterEach(() => {
        mockedStore && mockedStore.restore();
        sandbox.restore();
    });


    describe('linkTwilioChannel', () => {
        it('should set the twilio integration to pending state', () => {
            return integrationsService.linkTwilioChannel('1', {
                type: 'twilio',
                phoneNumber: '+0123456789'
            }).then(() => {
                coreMock.appUsers.linkChannel.should.have.been.calledWith('1', {
                    type: 'twilio',
                    phoneNumber: '+0123456789'
                });
            });
        });
    });

    describe('unlinkTwilioChannel', () => {
        it('should set the twilio integration state to unlinked', () => {
            return integrationsService.unlinkTwilioChannel('1').then(() => {
                coreMock.appUsers.unlinkChannel.should.have.been.calledWith('1', 'twilio');
            });
        });
    });

    describe('pingTwilioChannel', () => {
        it('should call the ping channel API', () => {
            return integrationsService.pingTwilioChannel('1').then(() => {
                coreMock.appUsers.pingChannel.should.have.been.calledWith('1', 'twilio');
            });
        });
    });
});
