import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import { HeaderComponent } from 'components/header.jsx';

const sandbox = sinon.sandbox.create();

describe('Header', () => {
    afterEach(() => {
        sandbox.restore();
    });

    describe('main view', () => {
        const props = {
            appState: {
                widgetOpened: false,
                settingsEnabled: false,
                settingsVisible: false,
            },
            actions: {
                showSettings: sandbox.spy(),
                hideSettings: sandbox.spy()
            },
            ui: {
                text: {
                    headerText: 'Header',
                    settingsHeaderText: 'Settings'
                }
            }
        };

        it('should display the main header', () => {
            var header = TestUtils.renderIntoDocument(
            <HeaderComponent {...props} />
            );

            var headerNode = ReactDOM.findDOMNode(header);

            headerNode.textContent.should.eq(props.ui.text.headerText);
        });
    })
});
