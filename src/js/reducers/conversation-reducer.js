import * as ConversationActions from 'actions/conversation-actions';
import { RESET } from 'actions/common-actions';

const INITIAL_STATE = {
    messages: [],
    unreadCount: 0
};

export function ConversationReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case ConversationActions.RESET:
        case ConversationActions.RESET_CONVERSATION:
            return Object.assign({}, INITIAL_STATE);
        case ConversationActions.SET_CONVERSATION:
            return Object.assign({}, action.conversation);
        case ConversationActions.ADD_MESSAGE:
            return Object.assign({}, state, {
                messages: [...state.messages, action.message]
            });
        case ConversationActions.INCREMENT_UNREAD_COUNT:
            return Object.assign({}, state, {
                unreadCount: state.unreadCount + 1
            });
        case ConversationActions.RESET_UNREAD_COUNT:
            return Object.assign({}, state, {
                unreadCount: 0
            });
        default:
            return state;
    }
}
