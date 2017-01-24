import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';

import { ConnectNotification } from '../../../src/js/components/connect-notification';
import * as appService from '../../../src/js/services/app';
import * as appUtils from '../../../src/js/utils/app';
import { CHANNEL_DETAILS } from '../../../src/js/constants/channels';

import { wrapComponentWithStore } from '../../utils/react';
import { createMockedStore } from '../../utils/redux';

const sandbox = sinon.sandbox.create();

function getStoreState(state = {}) {
    const defaultState = {
        app: {
            settings: {
                web: {
                    channels: {}
                }
            },
            integrations: []
        },
        ui: {
            text: {
                settingsNotificationText: 'settingsNotificationText',
                connectNotificationText: 'connectNotificationText'
            }
        },
        appState: {
            emailCaptureEnabled: false
        }
    };

    return Object.assign(defaultState, state);
}

describe('ConnectNotification Component', () => {
    let mockedStore;

    beforeEach(() => {
        sandbox.stub(appService, 'showChannelPage');
        sandbox.stub(appService, 'showSettings');
        sandbox.stub(appUtils, 'hasChannels');
        sandbox.stub(appUtils, 'getAppChannelDetails');
        mockedStore = createMockedStore(sandbox, getStoreState());
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should render nothing if has no channels and email capture is disabled', () => {
        const component = wrapComponentWithStore(ConnectNotification, null, mockedStore);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'connect-notification').length.should.eq(0);
    });

    describe('emailCaptureEnabled', () => {
        beforeEach(() => {
            appUtils.getAppChannelDetails.returns([]);
            mockedStore = createMockedStore(sandbox, getStoreState({
                appState: {
                    emailCaptureEnabled: true
                }
            }));
        });

        it('should render the email capture link', () => {
            appUtils.hasChannels.returns(false);

            const component = wrapComponentWithStore(ConnectNotification, null, mockedStore);

            const node = TestUtils.findRenderedDOMComponentWithTag(component, 'span');
            node.textContent.should.be.eq(getStoreState().ui.text.settingsNotificationText);
        });

        it('should not render the email capture link if has channels', () => {
            appUtils.hasChannels.returns(true);

            const component = wrapComponentWithStore(ConnectNotification, null, mockedStore);

            const nodes = TestUtils.scryRenderedDOMComponentsWithTag(component, 'span');
            nodes.length.should.eq(0);
        });
    });

    describe('channels', () => {
        beforeEach(() => {
            appUtils.hasChannels.returns(true);
        });

        it('should render links to all linkable channels', () => {
            appUtils.getAppChannelDetails.returns([
                {
                    channel: {
                        type: 'messenger'
                    },
                    details: CHANNEL_DETAILS.messenger
                },
                {
                    channel: {
                        type: 'telegram'
                    },
                    details: CHANNEL_DETAILS.telegram
                },
                {
                    channel: {
                        type: 'frontendEmail'
                    },
                    details: CHANNEL_DETAILS.frontendEmail
                }
            ]);

            const component = wrapComponentWithStore(ConnectNotification, null, mockedStore);
            const nodes = TestUtils.scryRenderedDOMComponentsWithTag(component, 'a');

            // should be 2 because frontendEmail isn't linkable
            nodes.length.should.eq(2);
        });

        it('should call showChannelPage when link is clicked', () => {
            appUtils.getAppChannelDetails.returns([
                {
                    channel: {
                        type: 'messenger'
                    },
                    details: CHANNEL_DETAILS.messenger
                }
            ]);

            const component = wrapComponentWithStore(ConnectNotification, null, mockedStore);
            const node = TestUtils.findRenderedDOMComponentWithTag(component, 'a');
            TestUtils.Simulate.click(node);
            appService.showChannelPage.should.have.been.calledWith('messenger');
        });
    });
});
