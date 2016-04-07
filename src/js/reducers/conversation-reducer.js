import * as ConversationActions from 'actions/conversation-actions';
import { RESET } from 'actions/common-actions';

const INITIAL_STATE = {
    messages: [],
    unreadCount: 0
};

const sortMessage = (messages) => messages.sort((a, b) => {
    // received is undefined when it's the temp message from the user
    if (!a.received) {
        return 1;
    }

    if (!b.received) {
        return -1;
    }

    return a.received - b.received;
});

const addMessage = (messages, message) => {
    const existingMessage = messages.find((m) => m._id === message._id);

    if (existingMessage) {
        return messages;
    }

    return sortMessage([...messages, message]);
};

export function ConversationReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case RESET:
        case ConversationActions.RESET_CONVERSATION:
            return Object.assign({}, INITIAL_STATE);
        case ConversationActions.SET_CONVERSATION:
            const {messages, ...rest} = action.conversation;
            return Object.assign({}, {
                ...rest,
                messages: sortMessage(messages)
            });
        case ConversationActions.ADD_MESSAGE:
            return Object.assign({}, state, {
                messages: addMessage(state.messages, action.message)
            });
        case ConversationActions.REMOVE_MESSAGE:
            return Object.assign({}, state, {
                messages: [...state.messages.filter((message) => message._id !== action.id)]
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
