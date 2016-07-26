import sinon from 'sinon';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { findDOMNode } from 'react-dom';

import { mockComponent } from '../../../utils/react';
import { ReactTelephoneInput } from '../../../../src/js/lib/react-telephone-input';

import { TwilioChannelContentComponent } from '../../../../src/js/components/channels/twilio-channel-content';

const sandbox = sinon.sandbox.create();

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
            number: '+151455555555',
            linkState: 'linked',
            phoneNumber: '123456789',
            numberValid: true,
            settings: {}
        };
        it('should render linked component', () => {
            component = TestUtils.renderIntoDocument(<TwilioChannelContentComponent {...linkedProps}/>);
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'linked-state').length.should.eq(1);
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedTelephoneInput').length.should.eq(0);

            const appUserPhoneNumber = TestUtils.findRenderedDOMComponentWithClass(component, 'phone-number');
            appUserPhoneNumber.textContent.should.eq(linkedProps.number);

            const appMakerPhoneNumber = TestUtils.scryRenderedDOMComponentsWithTag(component, 'a')[1];
            const domNode = findDOMNode(appMakerPhoneNumber);
            domNode.getAttribute('href').should.eql(`sms://${linkedProps.phoneNumber}`);
        });
    });

    describe('user has sms linking disabled', () => {
        const unlinkedProps = {
            number: '',
            linkState: 'unlinked',
            phoneNumber: '123456789',
            numberValid: false,
            settings: {}
        };

        it('should render unlinked component', () => {
            component = TestUtils.renderIntoDocument(<TwilioChannelContentComponent {...unlinkedProps}/>);
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedTelephoneInput').length.should.eq(1);
        });

        [true, false].forEach((numberValid) => {
            describe(`number is ${numberValid ? '' : 'not'} valid`, () => {
                it(`should ${numberValid ? '' : 'not'} display Continue button`, () => {
                    const props = {
                        ...unlinkedProps,
                        numberValid: numberValid
                    };
                    component = TestUtils.renderIntoDocument(<TwilioChannelContentComponent {...props}/>);
                    TestUtils.scryRenderedDOMComponentsWithClass(component, 'btn-sk-primary').length.should.eq(numberValid ? 1 : 0);
                });
            });
        });
    });

    describe('user is in pending state', () => {
        const pendingProps = {
            number: '+15145555555',
            linkState: 'pending',
            phoneNumber: '123456789',
            numberValid: true,
            settings: {}
        };

        it('should render pending component', () => {
            component = TestUtils.renderIntoDocument(<TwilioChannelContentComponent {...pendingProps}/>);
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedTelephoneInput').length.should.eq(0);

            const appUserPhoneNumber = TestUtils.findRenderedDOMComponentWithClass(component, 'phone-number');
            appUserPhoneNumber.textContent.should.eq(`${pendingProps.number} - Pending`);
        });
    });
});
