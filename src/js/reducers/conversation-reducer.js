import { MESSAGE_ADDED, MESSAGES_CLEARED, SET_CONVERSATION } from '../actions/conversation-actions';

const INITIAL_STATE = {
    messages: []
};

export function ConversationReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case SET_CONVERSATION:
            return Object.assign({}, action.conversation);
        case MESSAGE_ADDED:
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
