import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';
import deepAssign from 'deep-assign';

import { TypingIndicator } from '../../../src/js/components/typing-indicator';

import { wrapComponentWithStore } from '../../utils/react';
import { mockAppStore } from '../../utils/redux';


function getStoreState(state = {}) {
    const defaultState = {
        appState: {
            typingIndicatorAvatarUrl: ''
        }
    };

    return deepAssign(defaultState, state);
}

describe('TypingIndicator Component', () => {
    const sandbox = sinon.sandbox.create();

    afterEach(() => {
        sandbox.restore();
    });

    it('should render only indicator if no avatar', () => {
        const mockedStore = mockAppStore(sandbox, getStoreState());
        const component = wrapComponentWithStore(TypingIndicator, null, mockedStore);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-typing-indicator').length.should.eq(1);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-typing-indicator-avatar-placeholder').length.should.eq(1);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-typing-indicator-avatar').length.should.eq(0);
    });

    it('should render avatar if present', () => {
        const mockedStore = mockAppStore(sandbox, getStoreState({
            appState: {
                typingIndicatorAvatarUrl: 'http://some-url/'
            }
        }));
        const component = wrapComponentWithStore(TypingIndicator, null, mockedStore);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-typing-indicator').length.should.eq(1);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-typing-indicator-avatar-placeholder').length.should.eq(0);
        const node = TestUtils.findRenderedDOMComponentWithClass(component, 'sk-typing-indicator-avatar');
        expect(node).to.exist;
        node.src.should.eq('http://some-url/');
    });

});
