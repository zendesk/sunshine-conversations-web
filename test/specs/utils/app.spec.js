import { CHANNEL_DETAILS } from '../../../src/js/constants/channels';
import { getIntegration, hasChannels, getAppChannelDetails } from '../../../src/js/utils/app';

describe('App utils', () => {
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

    describe('hasChannels', () => {
        it('should return true if has channels', () => {
            hasChannels({
                channels: {
                    stripe: {
                        some: 'prop'
                    }
                }
            }).should.be.true;
        });

        it('should return false if has no channels', () => {
            hasChannels({
                channels: {}
            }).should.be.false;
        });
    });

    describe('getAppChannelDetails', () => {
        it('should return the channels with their details', () => {
            const channel1 = {
                type: 'messenger'
            };

            const channel2 = {
                type: 'telegram'
            };

            const details = getAppChannelDetails([channel1, channel2]);

            details[0].should.deep.eq({
                channel: channel1,
                details: CHANNEL_DETAILS[channel1.type]
            });

            details[1].should.deep.eq({
                channel: channel2,
                details: CHANNEL_DETAILS[channel2.type]
            });
        });
    });
});
