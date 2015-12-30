import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import { scryRenderedDOMComponentsWithAttribute } from 'test/utils/react';

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

    describe('text with link', () => {
        var props = Object.assign({}, defaultProps, {
            appState: {
                settingsNotificationVisible: true
            },
            ui: {
                text: {
                    settingsNotificationText: 'This is a text <a data-ui-settings-link>with a link</a>!'
                }
            },
            actions: {
                hideSettingsNotification: sandbox.spy(),
                showSettings: sandbox.spy()
            }
        });

        beforeEach(() => {
            sandbox.stub(NotificationComponent.prototype, 'onLinkClick');
            sandbox.spy(NotificationComponent.prototype, 'bindHandler');
            component = TestUtils.renderIntoDocument(<NotificationComponent {...props} />);
            componentNode = ReactDOM.findDOMNode(component);
        });

        it('should render a link and should bind the click handler', () => {
            var linkNode = componentNode.querySelector('[data-ui-settings-link]');
            linkNode.should.exists;
            component.bindHandler.should.have.been.calledOnce;

            // call onclick directly because TestUtils.Simulate.click
            // doesn't work on a node not rendered by a component
            linkNode.onclick();

            component.onLinkClick.should.have.been.calledOnce;
        });
    });


    describe('text without link', () => {
        var props = Object.assign({}, defaultProps, {
            appState: {
                settingsNotificationVisible: true
            },
            ui: {
                text: {
                    settingsNotificationText: 'This is a text without a link!'
                }
            },
            actions: {
                hideSettingsNotification: sandbox.spy(),
                showSettings: sandbox.spy()
            }
        });

        beforeEach(() => {
            sandbox.stub(NotificationComponent.prototype, 'onLinkClick');
            sandbox.spy(NotificationComponent.prototype, 'bindHandler');
            component = TestUtils.renderIntoDocument(<NotificationComponent {...props} />);
            componentNode = ReactDOM.findDOMNode(component);
        });

        it('should render not have a link', () => {
            var linkNode = componentNode.querySelector('[data-ui-settings-link]');
            expect(linkNode).to.not.exists;
            component.bindHandler.should.have.been.calledOnce;
        });
    });

    describe('onLinkClick', () => {
        var props = Object.assign({}, defaultProps, {
            appState: {
                settingsNotificationVisible: true
            },
            ui: {
                text: {
                    settingsNotificationText: 'This is a text without a link!'
                }
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

        it('should dispatch a close notification action and a show settings action', () => {
            component.onLinkClick({
                preventDefault: () => true
            });

            props.actions.hideSettingsNotification.should.have.been.calledOnce;
            props.actions.showSettings.should.have.been.calledOnce;
        });
    });


});
