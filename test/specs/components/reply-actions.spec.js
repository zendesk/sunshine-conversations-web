import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';

import { createMockedStore } from '../../utils/redux';
import { wrapComponentWithStore } from '../../utils/react';
import { ReplyActions } from '../../../src/js/components/reply-actions';

const conversationService = require('../../../src/js/services/conversation');


describe('ReplyActions Component', () => {
    let component;
    const sandbox = sinon.sandbox.create();
    const mockedStore = createMockedStore(sandbox, {
        app: {
            settings: {
                web: {
                    accentColor: '',
                    isAccentColorDark: true
                }
            }
        },
        ui: {
            text: {
                locationNotSupported: 'Location not supported'
            }
        }
    });

    const CHOICES = [
        {
            text: 'choice 1',
            payload: 'payload 1'
        },
        {
            text: 'choice 2',
            payload: 'payload 2',
            iconUrl: 'http://some-url/'
        },
        {
            text: 'Send Location',
            type: 'locationRequest'
        }
    ];

    beforeEach(() => {
        sandbox.stub(conversationService, 'sendMessage');
        sandbox.stub(conversationService, 'sendLocation');
        navigator.geolocation = true;

        component = wrapComponentWithStore(ReplyActions, {
            choices: CHOICES
        }, mockedStore).getWrappedInstance();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should render choices', () => {
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'btn-sk-reply-action').forEach((node, index) => {
            const choice = CHOICES[index];
            node.textContent.trim().should.eq(choice.text);

            if (choice.type === 'locationRequest') {
                node.querySelectorAll('img').length.should.eq(0);
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-location-icon').length.should.be.eq(1);
            } else if (choice.iconUrl) {
                const icon = node.querySelector('img');
                icon.src.should.eq(choice.iconUrl);
            } else {
                node.querySelectorAll('img').length.should.eq(0);
            }
        });
    });

    it('should call sendMessage/sendLocation when clicked', () => {
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'btn-sk-reply-action').forEach((node, index) => {
            const choice = CHOICES[index];
            TestUtils.Simulate.click(node);

            if (choice.type === 'locationRequest') {
                conversationService.sendLocation.should.have.been.calledOnce;
            } else {
                conversationService.sendMessage.should.have.been.calledWith(choice.text);
            }
        });
    });
});
