import sinon from 'sinon';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import { Settings } from '../../../src/js/components/settings';
import { NotificationsSettings } from '../../../src/js/components/notifications-settings';
import { EmailSettings } from '../../../src/js/components/email-settings';
import * as appUtils from '../../../src/js/utils/app';

import { mockComponent, getContext, wrapComponentWithContext } from '../../utils/react';

const sandbox = sinon.sandbox.create();
const props = {
    className: 'class-name'
};

const context = getContext();

describe('Settings Component', () => {
    [true, false].forEach((hasChannels) => {
        describe(`has ${hasChannels ? '' : 'no'} channels`, () => {
            let component;

            beforeEach(() => {
                sandbox.stub(appUtils, 'hasChannels').returns(hasChannels);
                mockComponent(sandbox, NotificationsSettings, 'div', {
                    className: 'mockedNotificationSettings'
                });
                mockComponent(sandbox, EmailSettings, 'div', {
                    className: 'mockedEmailSettings'
                });

                component = wrapComponentWithContext(Settings, props, context);
            });

            afterEach(() => {
                sandbox.restore();
            });

            it(`should render the ${hasChannels ? 'NotificationSettings' : 'EmailSettings'} component`, () => {
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedNotificationSettings').length.should.eq(hasChannels ? 1 : 0);
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedEmailSettings').length.should.eq(hasChannels ? 0 : 1);
            });
        });
    });
});
