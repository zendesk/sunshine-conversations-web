import sinon from 'sinon';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import { ConnectNotificationComponent } from '../../../src/js/components/connect-notification';
const appService = require('../../../src/js/services/app-service');

import { ParentComponentWithContext } from '../../utils/parent-component';

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

const getComponent = (props, context) => {
    const wrapper = TestUtils.renderIntoDocument(
        <ParentComponentWithContext context={ context }
                                    withRef={ true }>
            <ConnectNotificationComponent {...props} />
        </ParentComponentWithContext>
    );

    return wrapper.getWrappedInstance();
};

describe('ConnectNotification', () => {

    beforeEach(() => {
        sandbox.stub(appService, 'showChannelPage');
        sandbox.stub(appService, 'showSettings');
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should render nothing if has no channels and email capture is disabled', () => {
        const component = getComponent(baseProps, baseContext);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'connect-notification').length.should.eq(0);
    });

    describe('emailCaptureEnabled', () => {
        it('should render the email capture link', () => {
            const props = {
                ...baseProps,
                emailCaptureEnabled: true
            };

            const component = getComponent(props, baseContext);

            const node = TestUtils.findRenderedDOMComponentWithTag(component, 'span');
            node.textContent.should.be.eq(baseContext.ui.text.settingsNotificationText);
        });
    });

});
