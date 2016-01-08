import { UserReducer } from 'reducers/user-reducer';
import { SET_USER, RESET_USER } from 'actions/user-actions';

describe('User reducer', () => {
    it('should be empty initialy', () => {
        Object.keys(UserReducer(undefined, {})).length.should.eq(0);
    });

    it('should set the state with the actions prop on SET_USER', () => {
        UserReducer(undefined, {
            type: SET_USER,
            user: {
                some: 'prop'
            }
        }).some.should.eq('prop');
    });

    it('should clear the state on RESET_USER', () => {
        Object.keys(UserReducer({
            some: 'prop'
        }, {
            type: RESET_USER
        })).length.should.eq(0);
    });
});
