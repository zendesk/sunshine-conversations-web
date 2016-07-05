import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';

import { ConnectNotificationComponent } from '../../../src/js/components/connect-notification';
const appService = require('../../../src/js/services/app-service');

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
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should render nothing if has no channels and email capture is disabled', () => {
        const component = wrapComponentWithContext(ConnectNotificationComponent, baseProps, baseContext);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'connect-notification').length.should.eq(0);
    });

    describe('emailCaptureEnabled', () => {
        it('should render the email capture link', () => {
            const props = {
                ...baseProps,
                emailCaptureEnabled: true
            };

            const component = wrapComponentWithContext(ConnectNotificationComponent, props, baseContext);

            const node = TestUtils.findRenderedDOMComponentWithTag(component, 'span');
            node.textContent.should.be.eq(baseContext.ui.text.settingsNotificationText);
        });
    });

    describe('channels', () => {

    });

});
