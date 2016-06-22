import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import { NotificationsSettingsComponent } from '../../../src/js/components/notifications-settings';

const sandbox = sinon.sandbox.create();


xdescribe('Notifications Settings', () => {

    let component;
    let componentNode;
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            message: 'This is a text <a data-ui-settings-link>with a link</a>!',
            actions: {
                hideNotification: sandbox.spy(),
                showSettings: sandbox.spy()
            }
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    xdescribe('text with link', () => {
        var props;

        beforeEach(() => {
            props = Object.assign({}, defaultProps);
            sandbox.stub(NotificationsSettingsComponent.prototype, 'onLinkClick');
            sandbox.spy(NotificationsSettingsComponent.prototype, 'bindHandler');
            component = TestUtils.renderIntoDocument(<NotificationsSettingsComponent {...props} />);
            componentNode = ReactDOM.findDOMNode(component);
        });

        it('should render a link and should bind the click handler', () => {
            const linkNode = componentNode.querySelector('[data-ui-settings-link]');
            linkNode.should.exists;
            component.bindHandler.should.have.been.calledOnce;

            // call onclick directly because TestUtils.Simulate.click
            // doesn't work on a node not rendered by a component
            linkNode.onclick();

            component.onLinkClick.should.have.been.calledOnce;
        });
    });


    xdescribe('text without link', () => {
        var props;

        beforeEach(() => {
            props = Object.assign({}, defaultProps, {
                message: 'This is a text without a link!'
            });
            sandbox.stub(NotificationsSettingsComponent.prototype, 'onLinkClick');
            sandbox.spy(NotificationsSettingsComponent.prototype, 'bindHandler');
            component = TestUtils.renderIntoDocument(<NotificationsSettingsComponent {...props} />);
            componentNode = ReactDOM.findDOMNode(component);
        });

        it('should render not have a link', () => {
            var linkNode = componentNode.querySelector('[data-ui-settings-link]');
            expect(linkNode).to.not.exists;
            component.bindHandler.should.have.been.calledOnce;
        });
    });

    xdescribe('onLinkClick', () => {
        var props;

        beforeEach(() => {
            props = Object.assign({}, defaultProps);
            component = TestUtils.renderIntoDocument(<NotificationsSettingsComponent {...props} />);
            componentNode = ReactDOM.findDOMNode(component);
        });

        it('should dispatch a close notification action and a show settings action', () => {
            component.onLinkClick({
                preventDefault: () => true,
                stopPropagation: () => true
            });

            props.actions.hideNotification.should.have.been.calledOnce;
            props.actions.showSettings.should.have.been.calledOnce;
        });


    });
});
