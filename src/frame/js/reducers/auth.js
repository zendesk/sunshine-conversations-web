import { SET_AUTH, RESET_AUTH } from '../actions/auth';
import { RESET } from '../actions/common';

const INITIAL_STATE = {
    jwt: null,
    sessionToken: null
};

export default function AuthReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case RESET:
        case RESET_AUTH:
            return {
                ...INITIAL_STATE
            };
        case SET_AUTH:
            return {
                ...state,
                jwt: action.jwt,
                sessionToken: action.sessionToken
            };
        default:
            return state;
    }
}
