import { AppStateReducer } from '../../../src/js/reducers/app-state-reducer';
import { TOGGLE_WIDGET, OPEN_WIDGET, CLOSE_WIDGET, DISABLE_ANIMATION } from '../../../src/js/actions/app-state-actions';

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
});
