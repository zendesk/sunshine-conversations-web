import { MESSAGE_RECEIVED, MESSAGES_CLEARED } from '../actions/conversation-actions';

const INITIAL_STATE = {
    messages: []
};

export function AppReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case MESSAGE_RECEIVED:
            return Object.assign({}, state, {
                messages: [...state.messages, action.message]
            });

        case MESSAGES_CLEARED:
            return Object.assign({}, {
                messages: []
            });
        default:
            return state;
    }
}
