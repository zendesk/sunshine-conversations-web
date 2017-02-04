import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';
import deepAssign from 'deep-assign';

import { EmailSettings, EmailSettingsComponent } from '../../../src/js/components/email-settings';
import * as userService from '../../../src/js/services/user';

import { createMockedStore } from '../../utils/redux';
import { wrapComponentWithStore } from '../../utils/react';

const sandbox = sinon.sandbox.create();

function getStoreState(state = {}) {
    const defaultState = {
        user: {
            email: ''
        },
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
                settingsReadOnlyText: 'This is readonly',
                settingsText: 'This is settings',
                settingsInputPlaceholder: 'This is a placeholder',
                settingsSaveButtonText: 'This is a button text'
            }
        },
        appState: {
            settingsNotificationVisible: false,
            readOnlyEmail: false
        }
    };

    return deepAssign(defaultState, state);
}

describe('Email Settings Component', () => {

    let component;
    let mockedStore;

    beforeEach(() => {
        sandbox.stub(userService, 'immediateUpdate');
        userService.immediateUpdate.resolves();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('Email read-only', () => {
        beforeEach(() => {
            mockedStore = createMockedStore(sandbox, getStoreState({
                appState: {
                    readOnlyEmail: true
                }
            }));
            component = wrapComponentWithStore(EmailSettings, null, mockedStore).getWrappedInstance();
        });

        it('should render the read-only text', () => {
            component.refs.description.textContent.should.eq(mockedStore.getState().ui.text.settingsReadOnlyText);
        });

        it('should put user email in input', () => {
            component.refs.input.value.should.eq(mockedStore.getState().user.email);
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

        beforeEach(() => {
            mockedStore = createMockedStore(sandbox, getStoreState());
            component = wrapComponentWithStore(EmailSettings, null, mockedStore).getWrappedInstance();
        });

        it('should render the normal text', () => {
            component.refs.description.textContent.should.eq(mockedStore.getState().ui.text.settingsText);
        });

        it('should put user email in input', () => {
            component.refs.input.value.should.eq(mockedStore.getState().user.email);
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
        beforeEach(() => {
            sandbox.stub(EmailSettingsComponent.prototype, 'onChange');
            mockedStore = createMockedStore(sandbox, getStoreState());
            component = wrapComponentWithStore(EmailSettings, null, mockedStore);
        });

        it('should call onChange', () => {
            TestUtils.Simulate.change(component.refs.input);
            EmailSettingsComponent.prototype.onChange.should.have.been.calledOnce;
        });


    });

    // TODO : figure how to spy on class properties
    xdescribe('Save button', () => {

        beforeEach(() => {
            sandbox.stub(EmailSettingsComponent, 'save');
            mockedStore = createMockedStore(sandbox, getStoreState({
                user: {
                    email: 'some@email.com'
                }
            }));
            component = wrapComponentWithStore(EmailSettings, null, mockedStore);
        });

        it('should call save', () => {
            TestUtils.Simulate.click(component.refs.button);
            EmailSettingsComponent.prototype.save.should.have.been.calledOnce;
        });
    });

    describe('Save', () => {
        let event;

        beforeEach(() => {
            const props = {
                actions: {
                    hideSettings: sandbox.stub()
                }
            };

            mockedStore = createMockedStore(sandbox, getStoreState({
                user: {
                    email: 'some@email.com'
                }
            }));

            component = wrapComponentWithStore(EmailSettings, props, mockedStore).getWrappedInstance();
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
