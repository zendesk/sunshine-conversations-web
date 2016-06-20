import sinon from 'sinon';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import { Settings } from '../../../src/js/components/settings';
import { NotificationsSettings } from '../../../src/js/components/notifications-settings';
import { EmailSettings } from '../../../src/js/components/email-settings';
import * as appUtils from '../../../src/js/utils/app';
import { mockComponent } from '../../utils/react';
import { createMockedStore } from '../../utils/redux';

import { ParentComponentWithContext } from '../../utils/parent-component';


const sandbox = sinon.sandbox.create();
const defaultProps = {
    className: 'class-name'
};


describe('Settings', () => {

    beforeEach(() => {
        sandbox.stub(appUtils, 'hasChannels');
        appUtils.hasChannels.resolves(false);

        mockComponent(sandbox, NotificationsSettings, 'div', {
            className: 'notificationSettings'
        });
        mockComponent(sandbox, EmailSettings, 'div', {
            className: 'emailSettings'
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Should render the NotificationSettings component', () => {

        const props = Object.assign({}, defaultProps, {});
        const store = createMockedStore(sandbox, props);
        const context = {settings: {}};
        const component = TestUtils.renderIntoDocument(<ParentComponentWithContext context={ context } store={ store }>
                <Settings {...props} />
            </ParentComponentWithContext>);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'notificationSettings').length.should.eq(1);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'emailSettings').length.should.eq(0);
    });

});
