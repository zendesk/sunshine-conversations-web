import { AppStateReducer } from '../../../src/js/reducers/app-state-reducer';
import { TOGGLE_WIDGET, OPEN_WIDGET, CLOSE_WIDGET, DISABLE_ANIMATION, SET_FETCHING_MORE_MESSAGES, SET_SHOULD_SCROLL_TO_BOTTOM } from '../../../src/js/actions/app-state-actions';

const INITIAL_STATE = AppStateReducer(undefined, {});

describe('App State reducer', () => {
    [TOGGLE_WIDGET, OPEN_WIDGET, CLOSE_WIDGET].forEach((action) => {
        describe(`${action} action`, () => {
            it('should set the showAnimation flag to true', () => {
                const beforeState = {
                    ...INITIAL_STATE,
                    showAnimation: false
                };
                const afterState = AppStateReducer(beforeState, {
                    type: action
                });
                afterState.showAnimation.should.eq(true);
            });
        });
    });

    describe('DISABLE_ANIMATION action', () => {
        it('should set the showAnimation flag to false', () => {
            const beforeState = {
                ...INITIAL_STATE,
                showAnimation: true
            };
            const afterState = AppStateReducer(beforeState, {
                type: DISABLE_ANIMATION
            });
            afterState.showAnimation.should.eq(false);
        });
    });

    describe('SET_FETCHING_MORE_MESSAGES action', () => {
        it('should set the isFetchingMoreMessages flag', () => {
            const beforeState = INITIAL_STATE;
            const afterState = AppStateReducer(beforeState, {
                type: SET_FETCHING_MORE_MESSAGES,
                value: true
            });
            beforeState.isFetchingMoreMessages.should.eq(false);
            afterState.isFetchingMoreMessages.should.eq(true);
        });
    });

    describe('SET_SHOULD_SCROLL_TO_BOTTOM action', () => {
        it('should set the shouldScrollToBottom flag', () => {
            const beforeState = INITIAL_STATE;
            const afterState = AppStateReducer(beforeState, {
                type: SET_SHOULD_SCROLL_TO_BOTTOM,
                value: false
            });
            beforeState.shouldScrollToBottom.should.eq(true);
            afterState.shouldScrollToBottom.should.eq(false);
        });
    });
});
