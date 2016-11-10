import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';

import { mockAppStore } from '../../utils/redux';
import { wrapComponentWithStore } from '../../utils/react';
import { QuickReplies } from '../../../src/js/components/quick-replies';

const conversationService = require('../../../src/js/services/conversation-service');


describe('QuickReplies Component', () => {
    let mockedStore;
    let component;
    const sandbox = sinon.sandbox.create();
    const CHOICES = [
        {
            text: 'choice 1',
            payload: 'payload 1'
        },
        {
            text: 'choice 2',
            payload: 'payload 2',
            iconUrl: 'http://some-url/'
        }
    ];

    beforeEach(() => {
        mockedStore = mockAppStore(sandbox, {
            app: {
                settings: {
                    web: {
                        accentColor: '',
                        isAccentColorDark: true
                    }
                }
            }
        });
        sandbox.stub(conversationService, 'sendMessage');

        component = wrapComponentWithStore(QuickReplies, {
            choices: CHOICES
        }, mockedStore).getWrappedInstance();
    });

    afterEach(() => {
        mockedStore && mockedStore.restore();
        sandbox.restore();
    });

    it('should render choices', () => {
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'btn-sk-quick-reply').forEach((node, index) => {
            const choice = CHOICES[index];
            node.textContent.trim().should.eq(choice.text);

            if (choice.iconUrl) {
                const icon = node.querySelector('img');
                icon.src.should.eq(choice.iconUrl);
            } else {
                node.querySelectorAll('img').length.should.eq(0);
            }
        });
    });

    it('should call sendMessage with payload when clicked', () => {
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'btn-sk-quick-reply').forEach((node, index) => {
            const choice = CHOICES[index];
            TestUtils.Simulate.click(node);
            conversationService.sendMessage.should.have.been.calledWith(choice.text, {
                payload: choice.payload
            });
        });
    });
});
