import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import { HeaderComponent } from 'components/header.jsx';

const sandbox = sinon.sandbox.create();

const defaultProps = {
    appState: {
        widgetOpened: false,
        settingsEnabled: false,
        settingsVisible: false,
    },
    actions: {
        showSettings: sandbox.spy(),
        hideSettings: sandbox.spy(),
        toggleWidget: sandbox.spy()
    },
    ui: {
        text: {
            headerText: 'Header',
            settingsHeaderText: 'Settings'
        }
    }
};

describe('Header', () => {
    afterEach(() => {
        sandbox.restore();
    });

    describe('main view', () => {
        const props = Object.assign({}, defaultProps);

        var header = TestUtils.renderIntoDocument(<HeaderComponent {...props} />);
        var headerNode = ReactDOM.findDOMNode(header);

        it('should display the main header', () => {
            headerNode.textContent.should.eq(props.ui.text.headerText);
        });

        it('should call the toggleWidget action on header click', () => {
            TestUtils.Simulate.click(headerNode);
            props.actions.toggleWidget.should.have.been.calledOnce;
        })
    });


    describe('settings view', () => {
        const props = Object.assign({}, defaultProps, {
            appState: {
                settingsEnabled: true,
                settingsVisible: true
            }
        });
        var header = TestUtils.renderIntoDocument(<HeaderComponent {...props} />);
        var headerNode = ReactDOM.findDOMNode(header);

        it('should display the settings header', () => {
            headerNode.textContent.should.eq(props.ui.text.settingsHeaderText);
        });
    });
});
