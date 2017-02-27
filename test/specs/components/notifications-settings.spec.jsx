import sinon from 'sinon';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import { NotificationChannelItem } from '../../../src/js/components/notification-channel-item';
import { NotificationsSettings } from '../../../src/js/components/notifications-settings';
import { CHANNEL_DETAILS } from '../../../src/js/constants/channels';

import { createMockedStore } from '../../utils/redux';
import { mockComponent, wrapComponentWithStore } from '../../utils/react';

import * as appUtils from '../../../src/js/utils/app';

const sandbox = sinon.sandbox.create();

describe('Notifications Settings', () => {

    let component;
    let mockedStore;

    const defaultStoreProps = {
        app: {
            integrations: [
                {
                    _id: 1,
                    type: 'telegram',
                    username: 'chloebot'
                },
                {
                    _id: 2,
                    type: 'messenger',
                    username: 'messengerchloe'
                }
            ],
        },

        ui: {
            text: {
                notificationSettingsChannelsTitle: 'notif settings channels title',
                notificationSettingsChannelsDescription: 'notif settings channels desc'
            }
        },
        user: {}
    };

    beforeEach(() => {
        mockComponent(sandbox, NotificationChannelItem, 'div', {
            className: 'mockedChannelItem'
        });

        sandbox.stub(appUtils, 'getAppChannelDetails');
        appUtils.getAppChannelDetails.returns([
            {
                channel: {
                    type: 'telegram'
                },
                details: CHANNEL_DETAILS.telegram
            },
            {
                channel: {
                    type: 'messenger'
                },
                details: CHANNEL_DETAILS.messenger
            }
        ]);

        const storeProps = {
            ...defaultStoreProps,
            user: {
                _id: 1230912,
                clients: []
            }
        };

        mockedStore = createMockedStore(sandbox, storeProps);

        component = wrapComponentWithStore(NotificationsSettings, null, mockedStore);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should render channel items', () => {
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedChannelItem').length.should.be.eq(2);
    });

    it('should set the header text', () => {
        const header = TestUtils.scryRenderedDOMComponentsWithClass(component, 'settings-header')[0];
        header.textContent.should.eq(mockedStore.getState().ui.text.notificationSettingsChannelsTitle);
    });

    it('should set channel description text', () => {
        const description = TestUtils.scryRenderedDOMComponentsWithClass(component, 'settings-description')[0];
        description.textContent.should.eq(mockedStore.getState().ui.text.notificationSettingsChannelsDescription);
    });

    describe('No user id', () => {
        beforeEach(() => {
            mockedStore = createMockedStore(sandbox, defaultStoreProps);

            component = wrapComponentWithStore(NotificationsSettings, null, mockedStore);
        });

        it('should not render', () => {
            const componentNode = ReactDOM.findDOMNode(component);
            expect(componentNode).to.be.null;
        });
    });
});
