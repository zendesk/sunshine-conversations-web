import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import { scryRenderedDOMComponentsWithId, findRenderedDOMComponentsWithId } from 'test/utils/react';
import * as appService from 'services/app-service';
import { HeaderComponent } from 'components/header.jsx';

const sandbox = sinon.sandbox.create();
let props;

describe('Header', () => {
    beforeEach(() => {
        sandbox.stub(appService, 'toggleWidget');
    });

    afterEach(() => {
        sandbox.restore();
    });

    [true, false].forEach((settingsEnabled) => {
        describe(`widget is closed with settings ${settingsEnabled ? 'enabled' : 'disabled'}`, () => {

            var header;
            var headerNode;

            beforeEach(() => {
                props = {
                    appState: {
                        widgetOpened: false,
                        settingsEnabled: settingsEnabled,
                        settingsVisible: false
                    },
                    conversation: {
                        messages: []
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
                header = TestUtils.renderIntoDocument(<HeaderComponent {...props} />);
                headerNode = ReactDOM.findDOMNode(header);
            });

            it('should not contain the back button', () => {
                TestUtils.scryRenderedDOMComponentsWithClass(header, 'sk-back-handle').length.should.be.eq(0);
            });

            it('should not contain the settings button', () => {
                scryRenderedDOMComponentsWithId(header, 'sk-settings-handle').length.should.be.eq(0);
            });

            it('should call the toggleWidget action on header click', () => {
                TestUtils.Simulate.click(headerNode);
                appService.toggleWidget.should.have.been.calledOnce;
            });

            it('should contain the show handle', () => {
                TestUtils.scryRenderedDOMComponentsWithClass(header, 'sk-show-handle').length.should.be.eq(1);
            });

            it('should not contain the close handle', () => {
                TestUtils.scryRenderedDOMComponentsWithClass(header, 'sk-close-handle').length.should.be.eq(0);
            });
        });
    });

    describe('default view with settings disabled', () => {

        var header;
        var headerNode;

        beforeEach(() => {
            props = {
                appState: {
                    widgetOpened: true,
                    settingsEnabled: false,
                    settingsVisible: false
                },
                conversation: {
                    messages: []
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
            header = TestUtils.renderIntoDocument(<HeaderComponent {...props} />);
            headerNode = ReactDOM.findDOMNode(header);
        });

        it('should display the main header', () => {
            headerNode.textContent.should.eq(props.ui.text.headerText);
        });

        it('should not contain the back button', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(header, 'sk-back-handle').length.should.be.eq(0);
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


    describe('default view with settings enabled', () => {

        var header;
        var headerNode;

        beforeEach(() => {
            props = {
                appState: {
                    widgetOpened: true,
                    settingsEnabled: true,
                    settingsVisible: false
                },
                conversation: {
                    messages: []
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
            header = TestUtils.renderIntoDocument(<HeaderComponent {...props} />);
            headerNode = ReactDOM.findDOMNode(header);
        });

        it('should display the main header', () => {
            headerNode.textContent.should.eq(props.ui.text.headerText);
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
            props.actions.showSettings.should.have.been.calledOnce;
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


    describe('default view in embedded mode', () => {

        var header;
        var headerNode;

        beforeEach(() => {
            props = {
                appState: {
                    widgetOpened: true,
                    settingsEnabled: true,
                    settingsVisible: false,
                    embedded: true
                },
                conversation: {
                    messages: []
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
            header = TestUtils.renderIntoDocument(<HeaderComponent {...props} />);
            headerNode = ReactDOM.findDOMNode(header);
        });

        it('should display the main header', () => {
            headerNode.textContent.should.eq(props.ui.text.headerText);
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
            props.actions.showSettings.should.have.been.calledOnce;
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


    describe('settings view', () => {

        var header;
        var headerNode;

        beforeEach(() => {
            props = {
                appState: {
                    settingsEnabled: true,
                    settingsVisible: true,
                    widgetOpened: true
                },
                conversation: {
                    messages: []
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
            header = TestUtils.renderIntoDocument(<HeaderComponent {...props} />);
            headerNode = ReactDOM.findDOMNode(header);
        });

        it('should display the settings header', () => {
            headerNode.textContent.should.eq(props.ui.text.settingsHeaderText);
        });

        it('should contain the back button', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(header, 'sk-back-handle').length.should.be.eq(1);
        });

        it('should not contain the settings button', () => {
            scryRenderedDOMComponentsWithId(header, 'sk-settings-handle').length.should.be.eq(0);
        });

        it('should call the hideSettings action on back button click', () => {
            const backButton = TestUtils.findRenderedDOMComponentWithClass(header, 'sk-back-handle');
            TestUtils.Simulate.click(backButton);
            props.actions.hideSettings.should.have.been.calledOnce;
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

        var header;
        var headerNode;

        beforeEach(() => {
            props = {
                appState: {
                    settingsEnabled: true,
                    settingsVisible: true,
                    widgetOpened: true,
                    embedded: true
                },
                conversation: {
                    messages: []
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
            header = TestUtils.renderIntoDocument(<HeaderComponent {...props} />);
            headerNode = ReactDOM.findDOMNode(header);
        });

        it('should display the settings header', () => {
            headerNode.textContent.should.eq(props.ui.text.settingsHeaderText);
        });

        it('should contain the back button', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(header, 'sk-back-handle').length.should.be.eq(1);
        });

        it('should not contain the settings button', () => {
            scryRenderedDOMComponentsWithId(header, 'sk-settings-handle').length.should.be.eq(0);
        });

        it('should call the hideSettings action on back button click', () => {
            const backButton = TestUtils.findRenderedDOMComponentWithClass(header, 'sk-back-handle');
            TestUtils.Simulate.click(backButton);
            props.actions.hideSettings.should.have.been.calledOnce;
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
