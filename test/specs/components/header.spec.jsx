import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import { scryRenderedDOMComponentsWithId, findRenderedDOMComponentsWithId, getContext } from '../../utils/react';
import * as appService from '../../../src/js/services/app-service';
import * as appUtils from '../../../src/js/utils/app';
import { HeaderComponent } from '../../../src/js/components/header';
import { ParentComponentWithContext } from '../../utils/parent-component';
import { mockAppStore } from '../../utils/redux';

const sandbox = sinon.sandbox.create();
const defaultProps = {
    appState: {
        emailCaptureEnabled: false,
        settingsVisible: true,
        widgetOpened: true,
        embedded: false,
        visibleChannelType: false
    },
    unreadCount: 0
};
const context = getContext({
    settings: {},
    ui: {
        text: {
            settingsHeaderText: 'settings header text',
            headerText: 'header text'
        }
    }
});

describe('Header', () => {
    let props;
    let mockedStore;
    let parentComponent;
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

    after(() => {
        mockedStore && mockedStore.restore();
    });

    describe('settings view', () => {

        beforeEach(() => {
            props = Object.assign(defaultProps, {});
            mockedStore = mockAppStore(sandbox, {});
            parentComponent = TestUtils.renderIntoDocument(<ParentComponentWithContext context={ context }
                                                                                       store={ mockedStore }
                                                                                       withRef={ true }>
                                                               <HeaderComponent {...props} />
                                                           </ParentComponentWithContext>);
            header = parentComponent.getWrappedInstance();
            headerNode = ReactDOM.findDOMNode(header);
        });

        it('should display the main header', () => {
            headerNode.textContent.should.eq(context.ui.text.settingsHeaderText);
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
            props = Object.assign(defaultProps, {
                appState: {
                    embedded: true
                }
            });
            mockedStore = mockAppStore(sandbox, {});
            parentComponent = TestUtils.renderIntoDocument(<ParentComponentWithContext context={ context }
                                                                                       store={ mockedStore }
                                                                                       withRef={ true }>
                                                               <HeaderComponent {...props} />
                                                           </ParentComponentWithContext>);
            header = parentComponent.getWrappedInstance();
            headerNode = ReactDOM.findDOMNode(header);
        });

        it('should display the main header', () => {
            headerNode.textContent.should.eq(context.ui.text.headerText);
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
