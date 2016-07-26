import { getDisplayName } from '../../../src/js/utils/user';

describe('User Utils', () => {
    describe('getDisplayName', () => {
        const CLIENTS = [
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
                info: {
                    phoneNumber: '+15145555555',
                    country: 'CA',
                    city: 'MONTREAL',
                    state: 'QC'
                },
                active: true
            }];

        ['messenger', 'twilio'].forEach((platform) => {
            describe(`${platform} channel`, () => {
                it(`should return ${platform === 'messenger' ? 'display name' : 'phone number'}`, () => {
                    const displayName = getDisplayName(CLIENTS, platform);
                    displayName.should.eql(platform === 'messenger' ? CLIENTS[1].displayName : CLIENTS[2].info.phoneNumber);
                });
            });
        });
    });
});
