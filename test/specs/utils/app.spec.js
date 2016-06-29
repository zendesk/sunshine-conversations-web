import { CHANNEL_DETAILS } from '../../../src/js/constants/channels';
import { getIntegration, hasChannels, getAppChannelDetails } from '../../../src/js/utils/app';

describe.only('App utils', () => {
    describe('getIntegration', () => {
        it('should return the first one it finds', () => {
            const type = 'messenger';
            const channel = {
                type,
                _id: '123',
                some: 'prop'
            };

            const sameTypeChannel = {
                type,
                _id: '456',
                some: 'other-prop'
            };

            const otherTypeChannel = {
                type: 'line',
                _id: '789',
                some: 'new-props'
            };

            const integration = getIntegration([
                otherTypeChannel,
                channel,
                sameTypeChannel
            ], type);

            integration.should.not.eq(otherTypeChannel);
            integration.should.not.eq(sameTypeChannel);
            integration.should.eq(channel);
        });

        it('should return undefined when no integration is matching', () => {
            const channel = {
                type: 'messenger',
                _id: '123',
                some: 'prop'
            };

            const sameTypeChannel = {
                type: 'messenger',
                _id: '456',
                some: 'other-prop'
            };

            const otherTypeChannel = {
                type: 'line',
                _id: '789',
                some: 'new-props'
            };

            const integration = getIntegration([
                otherTypeChannel,
                channel,
                sameTypeChannel
            ], 'stripeConnect');

            expect(integration).to.be.undefined;
        });
    });
});
