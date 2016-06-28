import sinon from 'sinon';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import { mockAppStore } from '../../utils/redux';
import { mockComponent, getContext } from '../../utils/react';

import { ChatInputComponent } from '../../../src/js/components/chat-input';
import { ImageUpload } from '../../../src/js/components/image-upload';
import { ParentComponentWithContext } from '../../utils/parent-component';
const conversationService = require('../../../src/js/services/conversation-service');

const sandbox = sinon.sandbox.create();

const props = {
    imageUploadEnabled: true,
    ui: {
        text: {
            inputPlaceholder: 'Placeholder',
            sendButtonText: 'Button'
        }
    }
};

function getStoreState(state = {}) {
    const defaultState = {
        conversation: {
            unreadCount: 0
        }
    };

    return Object.assign(defaultState, state);
}

function renderComponent(context, store, props) {
    const parentComponent = TestUtils.renderIntoDocument(<ParentComponentWithContext context={ context }
                                                                                     store={ store }
                                                                                     withRef={ true }>
                                                             <ChatInputComponent {...props} />
                                                         </ParentComponentWithContext>);
    return parentComponent.refs.childElement;
}

describe('ChatInput', () => {
    let component;
    let mockedStore;
    let context;

    let onChangeSpy;
    let onSendMessageSpy;
    let setStateSpy;

    let resetUnreadCountStub;
    let serviceSendMessageStub;

    beforeEach(() => {

        mockComponent(sandbox, ImageUpload, 'div', {
            className: 'image-upload'
        });

        onChangeSpy = sandbox.spy(ChatInputComponent.prototype, 'onChange');
        onSendMessageSpy = sandbox.spy(ChatInputComponent.prototype, 'onSendMessage');

        sandbox.stub(conversationService, 'uploadImage').resolves();
        resetUnreadCountStub = sandbox.stub(conversationService, 'resetUnreadCount');
        serviceSendMessageStub = sandbox.stub(conversationService, 'sendMessage');

        context = getContext({
            ui: {
                text: {
                    sendButtonText: 'send button text',
                    inputPlaceholder: 'input placeholder'
                }
            }
        });

        // spy on it after rendering to avoid triggering it when the component mounts
        setStateSpy = sandbox.spy(ChatInputComponent.prototype, 'setState');
    });

    afterEach(() => {
        mockedStore && mockedStore.restore();
        sandbox.restore();
    });

    it('should use the ui text', () => {
        mockedStore = mockAppStore(sandbox, getStoreState());
        component = renderComponent(context, mockedStore, props);
        component.refs.input.placeholder.should.eq(context.ui.text.inputPlaceholder);
        component.refs.button.textContent.should.eq(context.ui.text.sendButtonText);
    });

    describe('focus input', () => {
        it('should reset unread count if > 0', () => {
            mockedStore = mockAppStore(sandbox, getStoreState({
                conversation: {
                    unreadCount: 1
                }
            }));
            component = renderComponent(context, mockedStore, props);
            component.onFocus();

            resetUnreadCountStub.should.have.been.calledOnce;
        });

        it('should not reset unread count if == 0', () => {
            mockedStore = mockAppStore(sandbox, {
                conversation: {
                    unreadCount: 0
                }
            });
            component = renderComponent(context, mockedStore, props);
            component.onFocus();

            resetUnreadCountStub.should.not.have.been.called;
        });
    });

    describe('change input', () => {

        it('should call onChange when input triggers change', () => {
            mockedStore = mockAppStore(sandbox, getStoreState());
            component = renderComponent(context, mockedStore, props);
            TestUtils.Simulate.change(component.refs.input);
            onChangeSpy.should.have.been.calledOnce;
        });

        it('should change state when calling onChange', () => {
            mockedStore = mockAppStore(sandbox, getStoreState());
            component = renderComponent(context, mockedStore, props);
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
            mockedStore = mockAppStore(sandbox, {
                conversation: {
                    unreadCount: 1
                }
            });
            component = renderComponent(context, mockedStore, props);
            TestUtils.Simulate.change(component.refs.input);

            resetUnreadCountStub.should.have.been.calledOnce;
        });

        it('should not reset unread count if == 0', () => {
            mockedStore = mockAppStore(sandbox, {
                conversation: {
                    unreadCount: 0
                }
            });
            TestUtils.Simulate.change(component.refs.input);

            resetUnreadCountStub.should.not.have.been.called;
        });
    });

    describe('press button', () => {

        beforeEach(() => {
            mockedStore = mockAppStore(sandbox, getStoreState());
            component = renderComponent(context, mockedStore, props);
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
                mockedStore = mockAppStore(sandbox, getStoreState());
                const componentProps = Object.assign({}, props, {
                    imageUploadEnabled
                });
                component = renderComponent(context, mockedStore, componentProps);
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'image-upload').length.should.be.eq(imageUploadEnabled ? 1 : 0);
            });
        });
    });
});
