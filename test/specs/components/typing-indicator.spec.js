import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';
import deepAssign from 'deep-assign';

import { TypingIndicator } from '../../../src/js/components/typing-indicator';

import { wrapComponentWithStore } from '../../utils/react';
import { createMockedStore } from '../../utils/redux';


function getStoreState(state = {}) {
    const defaultState = {
        appState: {
            typingIndicatorAvatarUrl: '',
            typingIndicatorName: ''
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
        const mockedStore = createMockedStore(sandbox, getStoreState());
        const component = wrapComponentWithStore(TypingIndicator, null, mockedStore);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-typing-indicator').length.should.eq(1);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-typing-indicator-avatar-placeholder').length.should.eq(1);
        TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-typing-indicator-avatar').length.should.eq(0);
    });

    it('should render avatar if present', () => {
        const mockedStore = createMockedStore(sandbox, getStoreState({
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

    [true, false].forEach((firstInGroup) => {
        ['', 'http://some-url/'].forEach((avatarUrl) => {
            const mockedStore = createMockedStore(sandbox, getStoreState({
                appState: {
                    typingIndicatorAvatarUrl: avatarUrl,
                    typingIndicatorName: 'Some name'
                }
            }));

            describe(`is ${firstInGroup ? '' : ' not'} first in group ${avatarUrl ? 'with' : 'without'} avatar`, () => {
                it(`should ${firstInGroup ? '' : 'not'} render a name`, () => {
                    const component = wrapComponentWithStore(TypingIndicator, null, mockedStore);
                    TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-typing-indicator').length.should.eq(1);
                    TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-typing-indicator-avatar-placeholder').length.should.eq(avatarUrl ? 0 : 1);
                    if (avatarUrl) {
                        const node = TestUtils.findRenderedDOMComponentWithClass(component, 'sk-typing-indicator-avatar');
                        expect(node).to.exist;
                        node.src.should.eq(avatarUrl);
                    } else {
                        TestUtils.scryRenderedDOMComponentsWithClass(component, 'sk-typing-indicator-avatar').length.should.eq(0);
                    }
                });
            });
        });
    });

});
