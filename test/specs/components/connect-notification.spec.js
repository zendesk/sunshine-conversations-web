import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';

import { ConnectNotification, __Rewire__ as ConnectNotificationRewire } from '../../../src/frame/js/components/connect-notification';
import { CHANNEL_DETAILS } from '../../../src/frame/js/constants/channels';

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
    let showChannelPageSpy;
    let hasChannelsStub;
    let getAppChannelDetailsStub;

    beforeEach(() => {
        showChannelPageSpy = sandbox.spy();
        hasChannelsStub = sandbox.stub();
        getAppChannelDetailsStub = sandbox.stub();
        ConnectNotificationRewire('showChannelPage', showChannelPageSpy);
        ConnectNotificationRewire('hasChannels', hasChannelsStub);
        ConnectNotificationRewire('getAppChannelDetails', getAppChannelDetailsStub);

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
            getAppChannelDetailsStub.returns([]);
            mockedStore = createMockedStore(sandbox, getStoreState({
                appState: {
                    emailCaptureEnabled: true
                }
            }));
        });

        it('should render the email capture link', () => {
            hasChannelsStub.returns(false);

            const component = wrapComponentWithStore(ConnectNotification, null, mockedStore);

            const node = TestUtils.findRenderedDOMComponentWithTag(component, 'span');
            node.textContent.should.be.eq(getStoreState().ui.text.settingsNotificationText);
        });

        it('should not render the email capture link if has channels', () => {
            hasChannelsStub.returns(true);

            const component = wrapComponentWithStore(ConnectNotification, null, mockedStore);

            const nodes = TestUtils.scryRenderedDOMComponentsWithTag(component, 'span');
            nodes.length.should.eq(0);
        });
    });

    describe('channels', () => {
        beforeEach(() => {
            hasChannelsStub.returns(true);
        });

        it('should render links to all linkable channels', () => {
            getAppChannelDetailsStub.returns([
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
            getAppChannelDetailsStub.returns([
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
            showChannelPageSpy.should.have.been.calledWith('messenger');
        });
    });
});
