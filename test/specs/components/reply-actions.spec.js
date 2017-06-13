import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';

import { createMockedStore } from '../../utils/redux';
import { wrapComponentWithStore } from '../../utils/react';
import { ReplyActions, __Rewire__ as ReplyActionsRewire } from '../../../src/frame/js/components/reply-actions';


describe('ReplyActions Component', () => {
    let component;
    let hasGeolocationSupportStub;
    let sendMessageStub;
    let sendLocationStub;

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
        hasGeolocationSupportStub = sandbox.stub().returns(true);
        ReplyActionsRewire('hasGeolocationSupport', hasGeolocationSupportStub);
        sendMessageStub = sandbox.stub().returnsAsyncThunk();
        ReplyActionsRewire('sendMessage', sendMessageStub);
        sendLocationStub = sandbox.stub().returnsAsyncThunk();
        ReplyActionsRewire('sendLocation', sendLocationStub);

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
                sendLocationStub.should.have.been.calledOnce;
                sendLocationStub.should.have.been.calledWith({
                    metadata: choice.metadata
                });
            } else {
                sendMessageStub.should.have.been.calledWith({
                    text: choice.text,
                    payload: choice.payload,
                    metadata: choice.metadata
                });
            }
        });
    });
});
