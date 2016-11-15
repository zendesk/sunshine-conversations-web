import * as ConversationActions from '../actions/conversation-actions';
import { RESET } from '../actions/common-actions';

const INITIAL_STATE = {
    messages: [],
    quickReplies: [],
    unreadCount: 0,
    hasMoreMessages: false,
    isFetchingMoreMessagesFromServer: false
};

const sortMessages = (messages) => messages.sort((messageA, messageB) => {
    // received is undefined when it's the temp message from the user
    if (!messageA.received && !messageB.received) {
        // `_clientSent` is a local only prop
        return messageA._clientSent - messageB._clientSent;
    }

    if (!messageA.received) {
        return 1;
    }

    if (!messageB.received) {
        return -1;
    }

    return messageA.received - messageB.received;
});

const manageGroupsBetweenMessages = (messages, previousMessageIndex, message) => {
    const previousMessage = previousMessageIndex >= 0 && messages[previousMessageIndex];
    if (previousMessage) {
        const messageAuthor = message.role === 'appUser' ? message.role : message.name;
        const previousMessageAuthor = previousMessage.role === 'appUser' ? previousMessage.role : previousMessage.name;

        if (previousMessage.role !== message.role) {
            previousMessage.lastInGroup = true;
            message.firstInGroup = true;
            message.lastInGroup = true;
        } else {
            if (messageAuthor !== previousMessageAuthor) {
                message.firstInGroup = true;
                message.lastInGroup = true;
            } else {
                message.lastInGroup = true;
                previousMessage.lastInGroup = false;
            }
        }

        messages[previousMessageIndex] = previousMessage;
    } else {
        message.firstInGroup = true;
        message.lastInGroup = true;
    }
};

const extractQuickReplies = ({actions=[]} = {}) => {
    return actions.filter(({type}) => type === 'reply');
};

const addMessage = (messages, message) => {
    const quickReplies = extractQuickReplies(message);
    const hasText = (message.text && message.text.trim()) || (message.mediaUrl && message.mediaUrl.trim());
    if (quickReplies.length > 0 && !hasText) {
        // if the message contains quick replies and has no text,
        // don't add it to the messages
        return messages;
    }

    const messagesLength = messages.length;
    manageGroupsBetweenMessages(messages, messagesLength - 1, message);
    return sortMessages([...messages, message]);
};


const matchMessage = (message, queryProps) => Object.keys(queryProps).every((key) => message[key] === queryProps[key]);

const replaceMessage = (messages, query, newMessage) => {
    const existingMessage = messages.find((message) => matchMessage(message, query));
    if (!existingMessage) {
        return messages;
    }

    if (existingMessage._clientId) {
        newMessage = {
            ...newMessage,
            _clientId: existingMessage._clientId,
            lastInGroup: existingMessage.lastInGroup,
            firstInGroup: existingMessage.firstInGroup
        };
    }

    const index = messages.indexOf(existingMessage);
    return [...messages.slice(0, index), newMessage, ...messages.slice(index + 1)];
};

const cleanUpMessages = (messages) => {
    const cleanedMessages = [];
    const messagesHash = {};

    // removes duplicate messages and empty messages
    messages.forEach((message) => {
        const key = message._id + message.role + message.mediaType;
        const hasText = (message.text && !!message.text.trim()) || (message.mediaUrl && !!message.mediaUrl.trim());
        if (!(key in messagesHash) && hasText) {
            messagesHash[key] = message;
            cleanedMessages.push(message);
        }
    });

    return cleanedMessages;
};

const assignGroups = (messages) => {
    messages.forEach((message, index) => {
        manageGroupsBetweenMessages(messages, index - 1, message);
    });
    return messages;
};

export function ConversationReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case RESET:
        case ConversationActions.RESET_CONVERSATION:
            return {
                ...INITIAL_STATE
            };
        case ConversationActions.SET_CONVERSATION:
            return {
                ...action.conversation,
                messages: state.messages
            };
        case ConversationActions.SET_MESSAGES:
            return {
                ...state,
                messages: assignGroups(sortMessages(cleanUpMessages(action.messages))),
                quickReplies: extractQuickReplies(action.messages[action.messages.length - 1])
            };
        case ConversationActions.ADD_MESSAGES:
            return {
                ...state,
                messages: assignGroups(sortMessages(cleanUpMessages(action.append ?
                    [...state.messages, ...action.messages] :
                    [...action.messages, ...state.messages]
                ))),
                quickReplies: extractQuickReplies(action.messages[action.messages.length - 1])
            };
        case ConversationActions.ADD_MESSAGE:
            return Object.assign({}, state, {
                messages: addMessage(state.messages, action.message),
                quickReplies: extractQuickReplies(action.message)
            });
        case ConversationActions.REPLACE_MESSAGE:
            return Object.assign({}, state, {
                messages: sortMessages(replaceMessage(state.messages, action.queryProps, action.message))
            });
        case ConversationActions.REMOVE_MESSAGE:
            return Object.assign({}, state, {
                messages: [...state.messages.filter((message) => !matchMessage(message, action.queryProps))]
            });
        case ConversationActions.INCREMENT_UNREAD_COUNT:
            return Object.assign({}, state, {
                unreadCount: state.unreadCount + 1
            });
        case ConversationActions.RESET_UNREAD_COUNT:
            return Object.assign({}, state, {
                unreadCount: 0
            });
        case ConversationActions.SET_FETCHING_MORE_MESSAGES_FROM_SERVER:
            return Object.assign({}, state, {
                isFetchingMoreMessagesFromServer: action.value
            });
        default:
            return state;
    }
}
