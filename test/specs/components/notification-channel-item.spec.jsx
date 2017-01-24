import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';

import { NotificationChannelItem } from '../../../src/js/components/notification-channel-item';

import { createMockedStore } from '../../utils/redux';
import { wrapComponentWithStore } from '../../utils/react';


const sandbox = sinon.sandbox.create();

describe('Notification Channel Item Component', () => {
    [true, false].forEach((linked) => {
        describe(`${linked ? '' : 'not'} linked`, () => {
            let component;
            let mockedStore;

            const defaultProps = {
                id: 'id',
                name: 'name',
                icon: '/icon/',
                icon2x: '/icon2x/',
                hasURL: 'true',
                displayName: 'displayname'
            };

            beforeEach(() => {
                const props = Object.assign(defaultProps, {
                    linked: linked
                });
                mockedStore = createMockedStore(sandbox, {
                    app: {
                        settings: {
                            web: {
                                linkColor: '#00000'
                            }
                        }
                    },
                    ui: {
                        text: {
                            notificationSettingsConnectedAs: 'connected as',
                            notificationSettingsConnected: 'connected'
                        }
                    }
                });

                component = wrapComponentWithStore(NotificationChannelItem, props, mockedStore);
            });

            afterEach(() => {
                sandbox.restore();
            });

            it(`should ${linked ? '' : 'not'} render with linked class`, () => {
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-item-linked').length.should.be.eq(linked ? 1 : 0);
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'linked').length.should.be.eq(linked ? 1 : 0);
            });

            it(`should ${linked ? '' : 'not'} show connected as`, () => {
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-item-connected-as').length.should.be.eq(linked ? 1 : 0);
            });

            it(`should ${linked ? '' : 'not'} show link`, () => {
                const linkElement = TestUtils.scryRenderedDOMComponentsWithClass(component, 'channel-item-right')[0];
                linkElement.textContent.should.be.eq(linked ? 'Open' : '');
            });
        });
    });
});
