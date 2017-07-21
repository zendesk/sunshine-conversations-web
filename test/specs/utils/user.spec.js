import { isChannelLinked, getDisplayName, getLinkableChannels, hasLinkableChannels } from '../../../src/frame/js/utils/user';

describe('User utils', () => {
    describe('isChannelLinked', () => {
        const clients = [
            {
                platform: 'messenger'
            },
            {
                platform: 'telegram'
            }
        ];

        it('should return true is any client matches type', () => {
            isChannelLinked(clients, 'telegram').should.be.true;
        });

        it('should return false is no client matches type', () => {
            isChannelLinked(clients, 'frontendEmail').should.be.false;
        });
    });

    describe('getDisplayName', () => {
        const clients = [
            {
                lastSeen: '2016-07-25T20:58:25.533Z',
                info: {
                    sdkVersion: '3.1.2',
                    URL: '',
                    userAgent: '',
                    referrer: '',
                    browserLanguage: '',
                    currentUrl: '',
                    currentTitle: ''
                },
                platform: 'web',
                id: 'abcdefghijklmnop',
                active: true
            },
            {
                displayName: 'Beep Boop',
                id: '987654321',
                platform: 'messenger',
                linkedAt: '2016-07-25T15:30:56.549Z',
                active: true
            },
            {
                lastSeen: '2016-07-25T18:53:05.069Z',
                id: '123456789',
                platform: 'twilio',
                linkedAt: '2016-07-25T18:53:05.064Z',
                displayName: '+15145555555',
                info: {
                    phoneNumber: '+15145555555',
                    country: 'CA',
                    city: 'MONTREAL',
                    state: 'QC'
                },
                active: true
            }
        ];

        it('should return nothing if no matching type', () => {
            expect(getDisplayName(clients, 'frontendEmail')).to.not.exist;
        });

        ['messenger', 'twilio'].forEach((platform) => {
            describe(`${platform} channel`, () => {
                it(`should return ${platform === 'messenger' ? 'display name' : 'phone number'}`, () => {
                    const displayName = getDisplayName(clients, platform);
                    displayName.should.eql(platform === 'messenger' ? clients[1].displayName : clients[2].displayName);
                });
            });
        });
    });

    describe('getLinkableChannels', () => {
        [
            {
                name: 'should return all channels that are linkable',
                appChannels: [{
                    type: 'messenger'
                }, {
                    type: 'telegram'
                }, {
                    type: 'frontendEmail'
                }],
                outcome: ['messenger', 'telegram']
            },
            {
                name: 'should not return non-linkable',
                appChannels: [{
                    type: 'messenger'
                }, {
                    type: 'stripeConnect'
                }, {
                    type: 'frontendEmail'
                }],
                outcome: ['messenger']
            }
        ].forEach(({appChannels, name, outcome}) => {
            it(name, () => {
                getLinkableChannels(appChannels).should.deep.eq(outcome);
            });
        });
    });

    describe('hasLinkableChannels', () => {
        [
            {
                name: 'should return true if user has any enabled linkable channels',
                appChannels: [{
                    type: 'messenger'
                }, {
                    type: 'telegram'
                }, {
                    type: 'frontendEmail'
                }],
                clients: [],
                outcome: true
            },
            {
                name: 'should return false if user has only unlinkable channels',
                appChannels: [{
                    type: 'frontendEmail'
                }],
                clients: [],
                outcome: false
            },
            {
                name: 'should return false if user already linked all linkable channels',
                appChannels: [{
                    type: 'messenger'
                }, {
                    type: 'telegram'
                }, {
                    type: 'frontendEmail'
                }],
                clients: [
                    {
                        platform: 'messenger'
                    },
                    {
                        platform: 'telegram'
                    }
                ],
                outcome: false
            },
            {
                name: 'should return true if user already linked some but not all linkable channels',
                appChannels: [{
                    type: 'messenger'
                }, {
                    type: 'telegram'
                }, {
                    type: 'frontendEmail'
                }],
                clients: [
                    {
                        platform: 'messenger'
                    }
                ],
                outcome: true
            }
        ].forEach(({appChannels, clients, settings, name, outcome}) => {
            it(name, () => {
                hasLinkableChannels(appChannels, clients, settings).should.eq(outcome);
            });
        });
    });
});
