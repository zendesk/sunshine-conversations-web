import sinon from 'sinon';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import deepAssign from 'deep-assign';

import * as appService from '../../../src/js/services/app';
import * as appUtils from '../../../src/js/utils/app';
import { WIDGET_STATE } from '../../../src/js/constants/app';
import { Header, HeaderComponent } from '../../../src/js/components/header';

import { createMockedStore } from '../../utils/redux';
import { scryRenderedDOMComponentsWithId, findRenderedDOMComponentsWithId, wrapComponentWithStore } from '../../utils/react';

const sandbox = sinon.sandbox.create();

function getStoreState(state = {}) {
    const defaultState = {
        app: {
            settings: {
                web: {
                    channels: {}
                }
            },
            integrations: []
        },
        ui: {
            text: {
                headerText: 'headerText',
                settingsHeaderText: 'settingsHeaderText'
            }
        },
        appState: {
            emailCaptureEnabled: false,
            settingsVisible: true,
            widgetState: WIDGET_STATE.OPENED,
            embedded: false,
            visibleChannelType: false
        },
        conversation: {
            unreadCount: 0
        }
    };

    return deepAssign(defaultState, state);
}

describe('Header Component', () => {
    let mockedStore;
    let header;
    let headerNode;

    beforeEach(() => {
        sandbox.stub(appService, 'toggleWidget');
        sandbox.stub(appUtils, 'hasChannels');
        appUtils.hasChannels.returns(true);
        sandbox.stub(HeaderComponent.prototype, 'showSettings');
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('settings view', () => {

        beforeEach(() => {
            mockedStore = createMockedStore(sandbox, getStoreState());
            header = wrapComponentWithStore(Header, null, mockedStore);
            headerNode = ReactDOM.findDOMNode(header);
        });

        it('should display the main header', () => {
            headerNode.textContent.should.eq(mockedStore.getState().ui.text.settingsHeaderText);
        });

        it('should contain the back button', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(header, 'sk-back-handle').length.should.be.eq(1);
        });

        it('should not contain the settings button', () => {
            scryRenderedDOMComponentsWithId(header, 'sk-settings-handle').length.should.be.eq(0);
        });

        it('should call the toggleWidget action on header click', () => {
            TestUtils.Simulate.click(headerNode);
            appService.toggleWidget.should.have.been.calledOnce;
        });

        it('should not contain the show handle', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(header, 'sk-show-handle').length.should.be.eq(0);
        });

        it('should contain the close handle', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(header, 'sk-close-handle').length.should.be.eq(1);
        });
    });

    describe('settings view in embedded mode', () => {

        beforeEach(() => {
            mockedStore = createMockedStore(sandbox, getStoreState({
                appState: {
                    settingsVisible: false,
                    embedded: true
                }
            }));
            header = wrapComponentWithStore(Header, null, mockedStore);
            headerNode = ReactDOM.findDOMNode(header);
        });

        it('should display the main header', () => {
            headerNode.textContent.should.eq(mockedStore.getState().ui.text.headerText);
        });

        it('should not contain the back button', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(header, 'sk-back-handle').length.should.be.eq(0);
        });

        it('should contain the settings button', () => {
            scryRenderedDOMComponentsWithId(header, 'sk-settings-handle').length.should.be.eq(1);
        });

        it('should call the openSettings action on settings button click', () => {
            const settingsButton = findRenderedDOMComponentsWithId(header, 'sk-settings-handle');
            TestUtils.Simulate.click(settingsButton);
            HeaderComponent.prototype.showSettings.should.have.been.calledOnce;
        });

        it('should not call the toggleWidget action on header click', () => {
            TestUtils.Simulate.click(headerNode);
            appService.toggleWidget.should.not.have.been.called;
        });

        it('should not contain the show handle', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(header, 'sk-show-handle').length.should.be.eq(0);
        });

        it('should not contain the close handle', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(header, 'sk-close-handle').length.should.be.eq(0);
        });
    });
});
