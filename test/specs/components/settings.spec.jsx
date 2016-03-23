import sinon from 'sinon';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import { SettingsComponent } from 'components/settings.jsx';
import * as userService from 'services/user-service';

const sandbox = sinon.sandbox.create();
const defaultProps = {
    appState: {
        settingsNotificationVisible: false,
        readOnlyEmail: false
    },
    ui: {
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

    beforeEach(() => {
        sandbox.stub(userService, 'immediateUpdate');
        userService.immediateUpdate.resolves();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('Email read-only', () => {
        var props = Object.assign({}, defaultProps, {
            appState: Object.assign({}, defaultProps.appState, {
                readOnlyEmail: true
            })
        });

        beforeEach(() => {
            component = TestUtils.renderIntoDocument(<SettingsComponent {...props} />);
        });

        it('should render the read-only text', () => {
            component.refs.description.textContent.should.eq(props.ui.text.settingsReadOnlyText);
        });

        it('should put user email in input', () => {
            component.refs.input.value.should.eq(props.user.email);
        });

        it('should disable the input', () => {
            component.refs.input.disabled.should.be.true;
        });

        it('should not have errors', () => {
            expect(component.refs.button).to.not.exist;
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'has-error').length.should.be.eq(0);
        });
    });

    describe('Email editable', () => {
        var props = Object.assign({}, defaultProps);

        beforeEach(() => {
            component = TestUtils.renderIntoDocument(<SettingsComponent {...props} />);
        });

        it('should render the normal text', () => {
            component.refs.description.textContent.should.eq(props.ui.text.settingsText);
        });

        it('should put user email in input', () => {
            component.refs.input.value.should.eq(props.user.email);
        });

        it('should enable the input', () => {
            component.refs.input.disabled.should.be.false;
        });

        it('should not have errors', () => {
            component.refs.button.disabled.should.be.false;
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'has-error').length.should.be.eq(0);
        });
    });

    describe('Input', () => {
        var props = Object.assign({}, defaultProps);

        beforeEach(() => {
            sandbox.stub(SettingsComponent.prototype, 'onChange');
            component = TestUtils.renderIntoDocument(<SettingsComponent {...props} />);
        });

        it('should call onChange', () => {
            TestUtils.Simulate.change(component.refs.input);
            SettingsComponent.prototype.onChange.should.have.been.calledOnce;
        });


    });

    describe('Save button', () => {
        var props = Object.assign({}, defaultProps, {
            user: {
                email: 'some@email.com'
            }
        });

        beforeEach(() => {
            sandbox.stub(SettingsComponent.prototype, 'save');
            component = TestUtils.renderIntoDocument(<SettingsComponent {...props} />);
        });

        it('should call save', () => {
            TestUtils.Simulate.click(component.refs.button);
            SettingsComponent.prototype.save.should.have.been.calledOnce;
        });
    });

    describe('Save', () => {
        var props = Object.assign({}, defaultProps, {
            user: {
                email: 'some@email.com'
            }
        });

        var event;

        beforeEach(() => {
            Object.assign(props, {
                actions: {
                    hideSettings: sandbox.stub()
                }
            });

            component = TestUtils.renderIntoDocument(<SettingsComponent {...props} />);
            sandbox.spy(component, 'setState');
            event = {
                preventDefault: sandbox.stub()
            };
        });

        it('should prevent button default behavior', () => {
            return component.save(event).then(() => {
                event.preventDefault.should.have.been.calledOnce;
            });
        });

        describe('valid email', () => {
            it('should call immediateUpdate and hideSettings', () => {
                return component.save(event).then(() => {
                    userService.immediateUpdate.should.have.been.calledOnce;
                });

            });
        });

        describe('invalid email', () => {

            beforeEach(() => {
                component.setState({
                    email: 'invalid email value'
                });
            });


            it('should update state with error', () => {
                return component.save(event).then(() => {
                    component.setState.should.have.been.calledWith({
                        hasError: true
                    });
                });
            });
        });


        describe('empty email', () => {

            beforeEach(() => {
                component.setState({
                    email: ''
                });
            });


            it('should update state with error', () => {
                return component.save(event).then(() => {
                    component.setState.should.have.been.calledWith({
                        hasError: true
                    });
                });
            });
        });

    });
});
