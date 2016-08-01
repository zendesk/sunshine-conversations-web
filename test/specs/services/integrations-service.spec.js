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
        coreMock.appUsers.link.linkChannel.resolves(pendingAppUser);
        coreMock.appUsers.link.deleteChannel.resolves();
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
                coreMock.appUsers.link.linkChannel.should.have.been.calledWith('1', {
                    type: 'twilio',
                    phoneNumber: '+0123456789'
                });
            });
        });
    });

    describe('deleteTwilioChannel', () => {
        it('should set the twilio integration state to unlinked', () => {
            return integrationsService.deleteTwilioChannel('1').then(() => {
                coreMock.appUsers.link.deleteChannel.should.have.been.calledWith('1', 'twilio');
            });

        });
    });
});
