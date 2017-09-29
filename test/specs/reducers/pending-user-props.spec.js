import PendingUserPropsReducer from '../../../src/frame/js/reducers/pending-user-props';
import { UPDATE_PENDING_USER_PROPS, RESET_PENDING_USER_PROPS } from '../../../src/frame/js/actions/user';

describe('PendingUserProps reducer', () => {
    it('should be empty initialy', () => {
        Object.keys(PendingUserPropsReducer(undefined, {})).length.should.eq(0);
    });
    it('should update user properties on UPDATE_PENDING_USER_PROPS', () => {
        const state = PendingUserPropsReducer({
            givenName: 'name'
        }, {});

        state.givenName.should.eq('name');

        const newState = PendingUserPropsReducer({
            givenName: 'name'
        }, {
            type: UPDATE_PENDING_USER_PROPS,
            properties: {
                givenName: 'other name'
            }
        });

        newState.givenName.should.eq('other name');
    });

    it('should clear the state on RESET_PENDING_USER_PROPS', () => {
        Object.keys(PendingUserPropsReducer({
            some: 'prop'
        }, {
            type: RESET_PENDING_USER_PROPS
        })).length.should.eq(0);
    });
});
