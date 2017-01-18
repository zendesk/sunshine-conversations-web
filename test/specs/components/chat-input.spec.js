import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';

import { createMockedStore } from '../../utils/redux';
import { mockComponent, wrapComponentWithStore } from '../../utils/react';

import { ChatInput, ChatInputComponent } from '../../../src/js/components/chat-input';
import { ImageUpload } from '../../../src/js/components/image-upload';
const conversationService = require('../../../src/js/services/conversation');

const sandbox = sinon.sandbox.create();

function getStoreState(state = {}) {
    const defaultState = {
        app: {
            settings: {
                web: {}
            }
        },
        appState: {
            imageUploadEnabled: true
        },
        conversation: {
            unreadCount: 0
        },
        ui: {
            text: {
                inputPlaceholder: 'Placeholder',
                sendButtonText: 'Button'
            }
        }
    };

    return Object.assign(defaultState, state);
}

describe('ChatInput Component', () => {
    let component;
    let mockedStore;

    let onChangeSpy;
    let onSendMessageSpy;
    let setStateSpy;

    let resetUnreadCountStub;
    let serviceSendMessageStub;

    beforeEach(() => {
        onChangeSpy = sandbox.spy(ChatInputComponent.prototype, 'onChange');
        onSendMessageSpy = sandbox.spy(ChatInputComponent.prototype, 'onSendMessage');

        mockComponent(sandbox, ImageUpload, 'div', {
            className: 'image-upload'
        });

        sandbox.stub(conversationService, 'uploadImage').resolves();
        resetUnreadCountStub = sandbox.stub(conversationService, 'resetUnreadCount');
        serviceSendMessageStub = sandbox.stub(conversationService, 'sendMessage');

        // spy on it after rendering to avoid triggering it when the component mounts
        setStateSpy = sandbox.spy(ChatInputComponent.prototype, 'setState');
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should use the ui text', () => {
        mockedStore = createMockedStore(sandbox, getStoreState());
        component = wrapComponentWithStore(ChatInput, null, mockedStore).getWrappedInstance();
        component.refs.input.placeholder.should.eq(mockedStore.getState().ui.text.inputPlaceholder);
        component.refs.button.textContent.should.eq(mockedStore.getState().ui.text.sendButtonText);
    });

    describe('focus input', () => {
        it('should reset unread count if > 0', () => {
            mockedStore = createMockedStore(sandbox, getStoreState({
                conversation: {
                    unreadCount: 1
                }
            }));

            component = wrapComponentWithStore(ChatInput, null, mockedStore).getWrappedInstance();
            component.onFocus();

            resetUnreadCountStub.should.have.been.calledOnce;
        });

        it('should not reset unread count if == 0', () => {
            mockedStore = createMockedStore(sandbox, getStoreState({
                conversation: {
                    unreadCount: 0
                }
            }));

            component = wrapComponentWithStore(ChatInput, null, mockedStore).getWrappedInstance();

            component.onFocus();

            resetUnreadCountStub.should.not.have.been.called;
        });
    });

    describe('change input', () => {

        it('should call onChange when input triggers change', () => {
            mockedStore = createMockedStore(sandbox, getStoreState());

            component = wrapComponentWithStore(ChatInput, null, mockedStore).getWrappedInstance();

            TestUtils.Simulate.change(component.refs.input);
            onChangeSpy.should.have.been.calledOnce;
        });

        it('should change state when calling onChange', () => {
            mockedStore = createMockedStore(sandbox, getStoreState());

            component = wrapComponentWithStore(ChatInput, null, mockedStore).getWrappedInstance();

            component.state.text.should.eq('');

            component.onChange({
                target: {
                    value: 'some text'
                }
            });

            setStateSpy.should.have.been.calledWith({
                text: 'some text'
            });

            component.state.text.should.eq('some text');
        });
        it('should reset unread count if > 0', () => {
            mockedStore = createMockedStore(sandbox, getStoreState({
                conversation: {
                    unreadCount: 1
                }
            }));

            component = wrapComponentWithStore(ChatInput, null, mockedStore).getWrappedInstance();

            TestUtils.Simulate.change(component.refs.input);

            resetUnreadCountStub.should.have.been.calledOnce;
        });

        it('should not reset unread count if == 0', () => {
            mockedStore = createMockedStore(sandbox, getStoreState({
                conversation: {
                    unreadCount: 0
                }
            }));
            component = wrapComponentWithStore(ChatInput, null, mockedStore).getWrappedInstance();
            TestUtils.Simulate.change(component.refs.input);

            resetUnreadCountStub.should.not.have.been.called;
        });
    });

    describe('press button', () => {

        beforeEach(() => {
            mockedStore = createMockedStore(sandbox, getStoreState());

            component = wrapComponentWithStore(ChatInput, null, mockedStore).getWrappedInstance();
        });

        it('should call sendMessage when clicking the button', () => {
            TestUtils.Simulate.click(component.refs.button);
            onSendMessageSpy.should.have.been.calledOnce;
        });

        it('should prevent default event behavior', () => {
            const event = {
                preventDefault: sandbox.stub()
            };
            component.onSendMessage(event);

            event.preventDefault.should.have.been.calledOnce;
        });

        ['', '      '].forEach((value) => {
            it('should do nothing if the current state is blank', () => {
                component.state.text = value;
                component.onSendMessage({
                    preventDefault: sandbox.stub()
                });

                setStateSpy.should.not.have.been.called;
                serviceSendMessageStub.should.not.have.been.called;
            });
        });

        it('should reset state and call conversation service if state not blank', () => {
            component.state.text = 'this is a value!';
            component.onSendMessage({
                preventDefault: sandbox.stub()
            });

            setStateSpy.should.have.been.calledWith({
                text: ''
            });

            component.state.text.should.eq('');

            serviceSendMessageStub.should.have.been.calledWith('this is a value!');
        });
    });

    describe('Image upload button', () => {
        [true, false].forEach((imageUploadEnabled) => {
            it(`should${imageUploadEnabled ? '' : 'not'} display the image upload button`, () => {
                mockedStore = createMockedStore(sandbox, getStoreState({
                    appState: {
                        imageUploadEnabled
                    }
                }));

                component = wrapComponentWithStore(ChatInput, null, mockedStore).getWrappedInstance();

                TestUtils.scryRenderedDOMComponentsWithClass(component, 'image-upload').length.should.be.eq(imageUploadEnabled ? 1 : 0);
            });
        });
    });
});
