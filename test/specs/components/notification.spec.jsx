import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import { mockComponent, scryRenderedDOMComponentsWithId, findRenderedDOMComponentsWithId } from 'test/utils/react';

import { NotificationComponent } from 'components/notification.jsx';

const sandbox = sinon.sandbox.create();
const defaultProps = {
    appState: {
        settingsNotificationVisible: false
    },
    ui: {
        text: {
            settingsNotificationText: 'Intro text'
        }
    }
};


describe('Notification', () => {

    var component;
    var componentNode;

    afterEach(() => {
        sandbox.restore();
    });

    describe('notification not visible', () => {
        var props = Object.assign({}, defaultProps, {
            actions: {
                hideSettingsNotification: sandbox.spy(),
                showSettings: sandbox.spy()
            }
        });

        beforeEach(() => {
            component = TestUtils.renderIntoDocument(<NotificationComponent {...props} />);
            componentNode = ReactDOM.findDOMNode(component);
        });

        it('should not render the notification', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-notifications').length.should.eq(0);
        });
    });

    describe('notification visible', () => {
        var props = Object.assign({}, defaultProps, {
            appState: {
                settingsNotificationVisible: true
            },
            actions: {
                hideSettingsNotification: sandbox.spy(),
                showSettings: sandbox.spy()
            }
        });

        beforeEach(() => {
            component = TestUtils.renderIntoDocument(<NotificationComponent {...props} />);
            componentNode = ReactDOM.findDOMNode(component);
        });

        it('should render the notification', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-notifications').length.should.eq(1);
        });
    });


});
