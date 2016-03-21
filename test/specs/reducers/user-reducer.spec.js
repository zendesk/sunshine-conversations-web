import { UserReducer } from 'reducers/user-reducer';
import { SET_USER, RESET_USER, UPDATE_USER } from 'actions/user-actions';

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

    it('should update user properties on UPDATE_USER', () => {
        const newState = UserReducer({
            _id: '12345'
        }, {
            type: UPDATE_USER,
            properties: {
                conversationStarted: true
            }
        });

        newState.conversationStarted.should.eq(true);
        newState._id.should.eq('12345');
    });

    it('should clear the state on RESET_USER', () => {
        Object.keys(UserReducer({
            some: 'prop'
        }, {
            type: RESET_USER
        })).length.should.eq(0);
    });
});
