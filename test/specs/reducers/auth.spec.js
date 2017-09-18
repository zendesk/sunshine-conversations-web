import AuthReducer from '../../../src/frame/js/reducers/auth';
import { SET_AUTH, RESET_AUTH } from '../../../src/frame/js/actions/auth';

describe('Auth reducer', () => {
    it('should set the state with the actions prop on SET_AUTH', () => {
        AuthReducer(undefined, {
            type: SET_AUTH,
            jwt: 'some-jwt'
        }).jwt.should.eq('some-jwt');

        AuthReducer(undefined, {
            type: SET_AUTH,
            sessionToken: 'some-sessionToken'
        }).sessionToken.should.eq('some-sessionToken');
    });

    it('should clear the state on RESET_AUTH', () => {
        const state = AuthReducer({
            jwt: 'some-jwt'
        }, {
            type: RESET_AUTH
        });

        expect(state.jwt).to.be.null;
        expect(state.sessionToken).to.be.null;
    });
});
