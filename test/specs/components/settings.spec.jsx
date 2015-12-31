import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import { scryRenderedDOMComponentsWithAttribute } from 'test/utils/react';

import { SettingsComponent } from 'components/settings.jsx';

const sandbox = sinon.sandbox.create();
const defaultProps = {
    appState: {
        settingsNotificationVisible: false
    },
    ui: {
        readOnlyEmail: false,
        text: {
            settingsReadOnlyText: 'This is readonly',
            settingsText: 'This is settings',
            settingsInputPlaceholder: 'This is a placeholder',
            settingsSaveButtonText: 'This is a button text'
        }
    },
    user: {
        email: 'some@email.com'
    }
};


describe('Settings', () => {

    var component;
    var componentNode;

    afterEach(() => {
        sandbox.restore();
    });

    describe('Email read-only', () => {
        var props = Object.assign({}, defaultProps, {
            ui: Object.assign({}, defaultProps.ui, {
                readOnlyEmail: true
            })
        });

        beforeEach(() => {
            component = TestUtils.renderIntoDocument(<SettingsComponent {...props} />);
            componentNode = ReactDOM.findDOMNode(component);
        });

        it('should render the read-only text', () => {
            component.refs.description.textContent.should.eq(props.ui.text.settingsReadOnlyText);
        });

        it('should disable the input', () => {
            component.refs.input.disabled.should.be.true;
        });

        it('should not have errors', () => {
            component.refs.button.disabled.should.be.false;
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'has-error').length.should.be.eq(0)
        });
    });

    describe('Email editable', () => {
        var props = Object.assign({}, defaultProps);

        beforeEach(() => {
            component = TestUtils.renderIntoDocument(<SettingsComponent {...props} />);
            componentNode = ReactDOM.findDOMNode(component);
        });

        it('should render the normal text', () => {
            component.refs.description.textContent.should.eq(props.ui.text.settingsText);
        });

        it('should enable the input', () => {
            component.refs.input.disabled.should.be.false;
        });

        it('should not have errors', () => {
            component.refs.button.disabled.should.be.false;
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'has-error').length.should.be.eq(0)
        });
    });
});
