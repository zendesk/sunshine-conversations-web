import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';

import { EmailSettingsComponent } from '../../../src/js/components/email-settings';
import * as userService from '../../../src/js/services/user-service';

import { wrapComponentWithContext } from '../../utils/react';

const sandbox = sinon.sandbox.create();
const defaultProps = {
    appState: {
        settingsNotificationVisible: false,
        readOnlyEmail: false
    },
    user: {
        email: 'some@email.com'
    }
};

const defaultContext = {
    ui: {
        text: {
            settingsReadOnlyText: 'This is readonly',
            settingsText: 'This is settings',
            settingsInputPlaceholder: 'This is a placeholder',
            settingsSaveButtonText: 'This is a button text'
        }
    },
    settings: {}
};


describe.only('Email Settings', () => {

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
            component = wrapComponentWithContext(EmailSettingsComponent, props, defaultContext);
        });
        it('should render the read-only text', () => {
            component.refs.description.textContent.should.eq(defaultContext.ui.text.settingsReadOnlyText);
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
            component = wrapComponentWithContext(EmailSettingsComponent, props, defaultContext);
        });

        it('should render the normal text', () => {
            component.refs.description.textContent.should.eq(defaultContext.ui.text.settingsText);
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

    // TODO : figure how to spy on class properties
    xdescribe('Input', () => {
        var props = Object.assign({}, defaultProps);

        beforeEach(() => {
            sandbox.stub(EmailSettingsComponent.prototype, 'onChange');
            component = wrapComponentWithContext(EmailSettingsComponent, props, defaultContext);
        });

        it('should call onChange', () => {
            TestUtils.Simulate.change(component.refs.input);
            EmailSettingsComponent.prototype.onChange.should.have.been.calledOnce;
        });


    });

    // TODO : figure how to spy on class properties
    xdescribe('Save button', () => {
        var props = Object.assign({}, defaultProps, {
            user: {
                email: 'some@email.com'
            }
        });

        beforeEach(() => {
            sandbox.stub(EmailSettingsComponent, 'save');
            component = wrapComponentWithContext(EmailSettingsComponent, props, defaultContext);
        });

        it('should call save', () => {
            TestUtils.Simulate.click(component.refs.button);
            EmailSettingsComponent.prototype.save.should.have.been.calledOnce;
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

            component = wrapComponentWithContext(EmailSettingsComponent, props, defaultContext);
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
