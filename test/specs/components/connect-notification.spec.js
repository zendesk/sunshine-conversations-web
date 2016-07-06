import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';

import { ConnectNotificationComponent } from '../../../src/js/components/connect-notification';
import * as appService from '../../../src/js/services/app-service';
import * as appUtils from '../../../src/js/utils/app';
import { CHANNEL_DETAILS } from '../../../src/js/constants/channels';

import { wrapComponentWithContext } from '../../utils/react';

const sandbox = sinon.sandbox.create();

const baseContext = {
    ui: {
        text: {
            settingsNotificationText: 'settingsNotificationText'
        }
    },
    settings: {
        channels: {}
    }
};

const baseProps = {
    appChannels: [],
    emailCaptureEnabled: false
};

describe('ConnectNotification Component', () => {

    beforeEach(() => {
        sandbox.stub(appService, 'showChannelPage');
        sandbox.stub(appService, 'showSettings');
        sandbox.stub(appUtils, 'hasChannels');
        sandbox.stub(appUtils, 'getAppChannelDetails');
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should render nothing if has no channels and email capture is disabled', () => {
        const component = wrapComponentWithContext(ConnectNotificationComponent, baseProps, baseContext);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'connect-notification').length.should.eq(0);
    });

    describe('emailCaptureEnabled', () => {
        beforeEach(() => {
            appUtils.getAppChannelDetails.returns([]);
        });

        it('should render the email capture link', () => {
            appUtils.hasChannels.returns(false);
            const props = {
                ...baseProps,
                emailCaptureEnabled: true
            };

            const component = wrapComponentWithContext(ConnectNotificationComponent, props, baseContext);

            const node = TestUtils.findRenderedDOMComponentWithTag(component, 'span');
            node.textContent.should.be.eq(baseContext.ui.text.settingsNotificationText);
        });

        it('should not render the email capture link if has channels', () => {
            appUtils.hasChannels.returns(true);
            const props = {
                ...baseProps,
                emailCaptureEnabled: true
            };

            const component = wrapComponentWithContext(ConnectNotificationComponent, props, baseContext);

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

            const component = wrapComponentWithContext(ConnectNotificationComponent, baseProps, baseContext);
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

            const component = wrapComponentWithContext(ConnectNotificationComponent, baseProps, baseContext);
            const node = TestUtils.findRenderedDOMComponentWithTag(component, 'a');
            TestUtils.Simulate.click(node);
            appService.showChannelPage.should.have.been.calledWith('messenger');
        });
    });
});
