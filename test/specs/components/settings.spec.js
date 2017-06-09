import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';

import { Settings, __Rewire__ as SettingsRewire } from '../../../src/frame/js/components/settings';
import { NotificationsSettings } from '../../../src/frame/js/components/notifications-settings';
import { EmailSettings } from '../../../src/frame/js/components/email-settings';

import { createMockedStore } from '../../utils/redux';
import { mockComponent, wrapComponentWithStore } from '../../utils/react';

const sandbox = sinon.sandbox.create();
const props = {
    className: 'class-name'
};

describe('Settings Component', () => {
    let hasChannelsStub;
    beforeEach(() => {
        hasChannelsStub = sandbox.stub();
        SettingsRewire('hasChannels', hasChannelsStub);
    });

    [true, false].forEach((hasChannels) => {
        describe(`has ${hasChannels ? '' : 'no'} channels`, () => {
            let component;

            beforeEach(() => {
                hasChannelsStub.returns(hasChannels);
                mockComponent(sandbox, NotificationsSettings, 'div', {
                    className: 'mockedNotificationSettings'
                });
                mockComponent(sandbox, EmailSettings, 'div', {
                    className: 'mockedEmailSettings'
                });

                const store = createMockedStore(sandbox, {
                    app: {
                        settings: {
                            web: {}
                        }
                    }
                });

                component = wrapComponentWithStore(Settings, props, store);
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
