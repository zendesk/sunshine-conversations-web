import { ADD_MESSAGE, MESSAGES_CLEARED, SET_CONVERSATION, RESET_CONVERSATION } from 'actions/conversation-actions';
import { RESET } from 'actions/common-actions';

const INITIAL_STATE = {
    messages: []
};

export function ConversationReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case RESET:
        case RESET_CONVERSATION:
            return Object.assign({}, INITIAL_STATE);
        case SET_CONVERSATION:
            return Object.assign({}, action.conversation);
        case ADD_MESSAGE:
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
