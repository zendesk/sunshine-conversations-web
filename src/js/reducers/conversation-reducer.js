import * as ConversationActions from 'actions/conversation-actions';
import { RESET } from 'actions/common-actions';

const INITIAL_STATE = {
    messages: [],
    unreadCount: 0
};

const sortMessages = (messages) => messages.sort((a, b) => {
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
    let existingMessage = messages.find((m) => m._id === message._id);

    // let's try to match against recently sent messages instead
    // also, restrict that to user messages since those from
    // appMakers will always have an id.
    if (!existingMessage && message.role === 'appUser') {
        existingMessage = messages.find((m) => !m._id && m.text === message.text && m.role === message.role);
    }

    if (existingMessage) {
        return messages;
    }

    return sortMessages([...messages, message]);
};

export function ConversationReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case RESET:
        case ConversationActions.RESET_CONVERSATION:
            return Object.assign({}, INITIAL_STATE);
        case ConversationActions.SET_CONVERSATION:
            return Object.assign({}, action.conversation, {
                messages: sortMessages(action.conversation.messages)
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
