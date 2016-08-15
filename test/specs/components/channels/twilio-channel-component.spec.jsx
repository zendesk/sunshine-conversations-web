import sinon from 'sinon';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import { mockComponent } from '../../../utils/react';
import { ReactTelephoneInput } from '../../../../src/js/lib/react-telephone-input';
import { ParentComponentWithContext } from '../../../utils/parent-component';

import { TwilioChannelContentComponent } from '../../../../src/js/components/channels/twilio-channel-content';

const sandbox = sinon.sandbox.create();

const context = {
    settings: {},
    ui: {
        text: {
            smsInvalidNumberError: 'Your phone number isn\'t valid. Please try again.',
            smsLinkPending: 'Pending',
            smsStartTexting: 'Start Texting',
            smsRetry: 'Retry',
            smsChangeNumber: 'Change my number',
            smsSendText: 'Send me a text',
            smsContinue: 'Continue'
        }
    }
};

const store = {};

function renderComponent(context, store, props) {
    const parentComponent = TestUtils.renderIntoDocument(<ParentComponentWithContext context={ context }
                                                                                     store={ store }
                                                                                     withRef={ true }>
                                                             <TwilioChannelContentComponent {...props} />
                                                         </ParentComponentWithContext>);
    return parentComponent.refs.childElement;
}

describe('Twilio Channel Content Component', () => {
    let component;

    beforeEach(() => {
        mockComponent(sandbox, ReactTelephoneInput, 'div', {
            className: 'mockedTelephoneInput'
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('user has sms linking enabled', () => {
        const linkedProps = {
            appUserNumber: '+151455555555',
            linkState: 'linked',
            phoneNumber: '123456789',
            appUserNumberValid: true,
            settings: {}
        };
        it('should render linked component', () => {
            component = renderComponent(context, store, linkedProps);
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'linked-state').length.should.eq(1);
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedTelephoneInput').length.should.eq(0);

            const appUserPhoneNumber = TestUtils.findRenderedDOMComponentWithClass(component, 'linked-state');
            appUserPhoneNumber.textContent.should.eq(`${linkedProps.appUserNumber}${context.ui.text.smsChangeNumber}`);

            const button = TestUtils.findRenderedDOMComponentWithClass(component, 'btn-sk-primary');
            button.textContent.should.eql(context.ui.text.smsSendText);
        });
    });

    describe('user has sms linking disabled', () => {
        const unlinkedProps = {
            appUserNumber: '',
            linkState: 'unlinked',
            phoneNumber: '123456789',
            appUserNumberValid: true,
            settings: {}
        };

        it('should render unlinked component', () => {
            component = renderComponent(context, store, unlinkedProps);
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedTelephoneInput').length.should.eq(1);
        });

        [true, false].forEach((appUserNumberValid) => {
            describe(`appUserNumber is ${appUserNumberValid ? '' : 'not'} valid`, () => {
                it(`should ${appUserNumberValid ? '' : 'not'} display Continue button`, () => {
                    const props = {
                        ...unlinkedProps,
                        appUserNumberValid: appUserNumberValid
                    };
                    component = renderComponent(context, store, props);
                    TestUtils.scryRenderedDOMComponentsWithClass(component, 'btn-sk-primary').length.should.eq(appUserNumberValid ? 1 : 0);

                    if (appUserNumberValid) {
                        const button = TestUtils.findRenderedDOMComponentWithClass(component, 'btn-sk-primary');
                        button.textContent.should.eql(context.ui.text.smsContinue);
                    }
                });
            });
        });

        describe('warning message', () => {
            it('should warn if phone number is invalid', () => {
                const props = {
                    ...unlinkedProps,
                    appUserNumber: '+0000000000',
                    appUserNumberValid: false
                };
                component = renderComponent(context, store, props);
                const warning = TestUtils.findRenderedDOMComponentWithClass(component, 'warning-message');
                warning.textContent.should.eq(context.ui.text.smsInvalidNumberError);
            });

            it('should warn if error', () => {
                const props = {
                    ...unlinkedProps,
                    hasError: true,
                    errorMessage: 'error-message'
                };
                component = renderComponent(context, store, props);
                const warning = TestUtils.findRenderedDOMComponentWithClass(component, 'warning-message');
                warning.textContent.should.eq(props.errorMessage);
            });
        });
    });

    describe('user is in pending state', () => {
        const pendingProps = {
            appUserNumber: '+15145555555',
            linkState: 'pending',
            phoneNumber: '123456789',
            appUserNumberValid: true,
            settings: {}
        };

        it('should render pending component', () => {
            component = renderComponent(context, store, pendingProps);
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedTelephoneInput').length.should.eq(0);

            const appUserPhoneNumber = TestUtils.findRenderedDOMComponentWithClass(component, 'phone-number');
            appUserPhoneNumber.textContent.should.eq(`${pendingProps.appUserNumber} - ${context.ui.text.smsLinkPending}`);
        });
    });
});
