import { AuthReducer } from 'reducers/auth-reducer';
import { SET_AUTH, RESET_AUTH } from 'actions/auth-actions';

describe('Auth reducer', () => {
    it('should be empty initialy', () => {
        Object.keys(AuthReducer(undefined, {})).length.should.eq(0);
    });

    it('should set the state with the actions prop on SET_AUTH', () => {
        AuthReducer(undefined, {
            type: SET_AUTH,
            props: {
                some: 'prop'
            }
        }).some.should.eq('prop');
    });

    it('should clear the state on RESET_AUTH', () => {
        Object.keys(AuthReducer({
            some: 'prop'
        }, {
            type: RESET_AUTH
        })).length.should.eq(0);
    });
});
