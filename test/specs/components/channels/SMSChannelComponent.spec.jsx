import sinon from 'sinon';
import TestUtils from 'react-dom/test-utils';

import { mockComponent, wrapComponentWithStore } from '../../../utils/react';
import { createMockedStore, generateBaseStoreProps } from '../../../utils/redux';
import { ReactTelephoneInput } from '../../../../src/frame/js/lib/react-telephone-input';

import SMSChannelContent from '../../../../src/frame/js/components/channels/SMSChannelContent';

const sandbox = sinon.sandbox.create();

describe('SMS Channel Content Component', () => {
    let component;
    let mockedStore;

    const storeState = generateBaseStoreProps({
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
    });

    beforeEach(() => {
        mockedStore = createMockedStore(sandbox, storeState);
        mockComponent(sandbox, ReactTelephoneInput, 'div', {
            className: 'mockedTelephoneInput'
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('user has sms linking enabled', () => {
        const linkedProps = {
            appUserId: '12345',
            phoneNumber: '123456789',
            channelState: {
                appUserNumber: '+151455555555',
                linkState: 'linked',
                appUserNumberValid: true
            }
        };
        it('should render linked component', () => {
            component = wrapComponentWithStore(SMSChannelContent, linkedProps, mockedStore);
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'linked-state').length.should.eq(1);
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedTelephoneInput').length.should.eq(0);

            const appUserPhoneNumber = TestUtils.findRenderedDOMComponentWithClass(component, 'linked-state');
            appUserPhoneNumber.textContent.should.eq(`${linkedProps.channelState.appUserNumber}${storeState.ui.text.smsChangeNumber}`);

            const button = TestUtils.findRenderedDOMComponentWithClass(component, 'btn-primary');
            button.textContent.should.eql(storeState.ui.text.smsSendText);
        });
    });

    describe('user has sms linking disabled', () => {
        const unlinkedProps = {
            appUserId: '12345',
            phoneNumber: '123456789',
            channelState: {
                appUserNumber: '',
                linkState: 'unlinked',
                appUserNumberValid: true
            }
        };

        it('should render unlinked component', () => {
            component = wrapComponentWithStore(SMSChannelContent, unlinkedProps, mockedStore);
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedTelephoneInput').length.should.eq(1);
        });

        [true, false].forEach((appUserNumberValid) => {
            describe(`appUserNumber is ${appUserNumberValid ? '' : 'not'} valid`, () => {
                it(`should ${appUserNumberValid ? '' : 'not'} display Continue button`, () => {
                    const props = {
                        ...unlinkedProps,
                        channelState: {
                            ...unlinkedProps.channelState,
                            appUserNumberValid: appUserNumberValid
                        }
                    };
                    component = wrapComponentWithStore(SMSChannelContent, props, mockedStore);
                    TestUtils.scryRenderedDOMComponentsWithClass(component, 'btn-primary').length.should.eq(appUserNumberValid ? 1 : 0);

                    if (appUserNumberValid) {
                        const button = TestUtils.findRenderedDOMComponentWithClass(component, 'btn-primary');
                        button.textContent.should.eql(storeState.ui.text.smsContinue);
                    }
                });
            });
        });

        describe('warning message', () => {
            it('should warn if phone number is invalid', () => {
                const props = {
                    ...unlinkedProps,
                    channelState: {
                        ...unlinkedProps.channelState,
                        appUserNumber: '+0000000000',
                        appUserNumberValid: false
                    }
                };
                component = wrapComponentWithStore(SMSChannelContent, props, mockedStore);
                const warning = TestUtils.findRenderedDOMComponentWithClass(component, 'warning-message');
                warning.textContent.should.eq(storeState.ui.text.smsInvalidNumberError);
            });

            it('should warn if error', () => {
                const props = {
                    ...unlinkedProps,
                    channelState: {
                        ...unlinkedProps.channelState,
                        hasError: true,
                        errorMessage: 'error-message'
                    }
                };
                component = wrapComponentWithStore(SMSChannelContent, props, mockedStore);
                const warning = TestUtils.findRenderedDOMComponentWithClass(component, 'warning-message');
                warning.textContent.should.eq(props.channelState.errorMessage);
            });
        });
    });

    describe('user is in pending state', () => {
        const pendingProps = {
            appUserId: '12345',
            channelState: {
                appUserNumberValid: true,
                appUserNumber: '+15145555555',
                linkState: 'pending'
            },
            phoneNumber: '123456789'
        };

        it('should render pending component', () => {
            component = wrapComponentWithStore(SMSChannelContent, pendingProps, mockedStore);
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedTelephoneInput').length.should.eq(0);

            const appUserPhoneNumber = TestUtils.findRenderedDOMComponentWithClass(component, 'phone-number');
            appUserPhoneNumber.textContent.should.eq(`${pendingProps.channelState.appUserNumber} - ${storeState.ui.text.smsLinkPending}`);
        });
    });
});
