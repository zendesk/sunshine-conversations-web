import sinon from 'sinon';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import { Settings } from '../../../src/js/components/settings';
import { NotificationsSettings } from '../../../src/js/components/notifications-settings';
import { EmailSettings } from '../../../src/js/components/email-settings';
import * as appUtils from '../../../src/js/utils/app';
import { mockComponent, getContext } from '../../utils/react';
import { mockAppStore } from '../../utils/redux';

import { ParentComponentWithContext } from '../../utils/parent-component';

const sandbox = sinon.sandbox.create();
const props = {
    className: 'class-name'
};
const context = getContext();

describe('Settings', () => {
    [true, false].forEach((hasChannels) => {
        describe(`has ${hasChannels ? '' : 'no'} channels`, () => {
            let mockedStore;
            let component;

            beforeEach(() => {
                sandbox.stub(appUtils, 'hasChannels');
                appUtils.hasChannels.returns(hasChannels);
                mockComponent(sandbox, NotificationsSettings, 'div', {
                    className: 'mockedNotificationSettings'
                });
                mockComponent(sandbox, EmailSettings, 'div', {
                    className: 'mockedEmailSettings'
                });

                mockedStore = mockAppStore(sandbox, {});
                component = TestUtils.renderIntoDocument(<ParentComponentWithContext context={ context }
                                                                                     store={ mockedStore }>
                                                             <Settings {...props} />
                                                         </ParentComponentWithContext>);
            });

            afterEach(() => {
                sandbox.restore();
            });

            after(() => {
                mockedStore && mockedStore.restore();
            });

            it(`should render the ${hasChannels ? 'NotificationSettings' : 'EmailSettings'} component`, () => {
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedNotificationSettings').length.should.eq(hasChannels ? 1 : 0);
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedEmailSettings').length.should.eq(hasChannels ? 0 : 1);
            });
        });
    });
});
