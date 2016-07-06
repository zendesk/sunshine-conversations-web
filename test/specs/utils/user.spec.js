import { isChannelLinked, getDisplayName, getLinkableChannels, hasLinkableChannels } from '../../../src/js/utils/user';

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
                platform: 'messenger',
                displayName: 'Smoochbot'
            }
        ];

        it('should return the display name for a matching client type', () => {
            getDisplayName(clients, 'messenger').should.eq('Smoochbot');
        });

        it('should return nothing if no matching type', () => {
            expect(getDisplayName(clients, 'frontendEmail')).to.not.exist;
        });
    });

    describe('getLinkableChannels', () => {
        [
            {
                name: 'should return all channels that are linkable and enabled',
                appChannels: [{
                    type: 'messenger'
                }, {
                    type: 'telegram'
                }, {
                    type: 'frontendEmail'
                }],
                settings: {
                    channels: {
                        messenger: true,
                        telegram: true,
                        frontendEmail: true
                    }
                },
                outcome: ['messenger', 'telegram']
            },
            {
                name: 'should not return non-linkable or disabled channels',
                appChannels: [{
                    type: 'messenger'
                }, {
                    type: 'telegram'
                }, {
                    type: 'frontendEmail'
                }],
                settings: {
                    channels: {
                        messenger: true,
                        telegram: false,
                        frontendEmail: true
                    }
                },
                outcome: ['messenger']
            }
        ].forEach(({appChannels, settings, name, outcome}) => {
            it(name, () => {
                getLinkableChannels(appChannels, settings).should.deep.eq(outcome);
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
                settings: {
                    channels: {
                        messenger: true,
                        telegram: true,
                        frontendEmail: true
                    }
                },
                outcome: true
            },
            {
                name: 'should return false if user has only unlinkable channels',
                appChannels: [{
                    type: 'frontendEmail'
                }],
                clients: [],
                settings: {
                    channels: {
                        frontendEmail: true
                    }
                },
                outcome: false
            },
            {
                name: 'should return false if user has disabled linkable channels',
                appChannels: [{
                    type: 'messenger'
                }, {
                    type: 'telegram'
                }, {
                    type: 'frontendEmail'
                }],
                clients: [],
                settings: {
                    channels: {
                        messenger: false,
                        telegram: false,
                        frontendEmail: true
                    }
                },
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
                settings: {
                    channels: {
                        messenger: true,
                        telegram: true,
                        frontendEmail: true
                    }
                },
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
                settings: {
                    channels: {
                        messenger: true,
                        telegram: true,
                        frontendEmail: true
                    }
                },
                outcome: true
            }
        ].forEach(({appChannels, clients, settings, name, outcome}) => {
            it(name, () => {
                hasLinkableChannels(appChannels, clients, settings).should.eq(outcome);
            });
        });
    });
});
