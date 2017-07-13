import * as ConversationActions from '../actions/conversation';
import { RESET } from '../actions/common';
import { SEND_STATUS, GLOBAL_ACTION_TYPES } from '../constants/message';

const INITIAL_STATE = {
    messages: [],
    replyActions: [],
    unreadCount: 0,
    hasMoreMessages: false,
    isFetchingMoreMessagesFromServer: false
};

const sortMessages = (messages) => messages.sort((messageA, messageB) => {
    const messageADate = messageA.received || messageA._clientSent;
    const messageBDate = messageB.received || messageB._clientSent;

    return messageADate - messageBDate;
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

const extractReplyActions = ({actions=[]} = {}) => {
    return actions.filter(({type}) => type === 'reply' || type === 'locationRequest');
};

const addMessage = (messages, message) => {
    const replyActions = extractReplyActions(message);

    const hasText = (message.text && message.text.trim()) || (message.mediaUrl && message.mediaUrl.trim());
    if (replyActions.length > 0 && !hasText) {
        // if the message contains reply actions and has no text,
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

const preserveFailedMessages = (messages) => {
    return messages.filter((message) => message.status = SEND_STATUS.FAILED);
};

const cleanUpMessages = (messages) => {
    const cleanedMessages = [];
    const messagesHash = {};

    // removes duplicate messages and empty messages
    messages.forEach((message) => {
        const messageText = (message.text && !!message.text.trim()) || (message.mediaUrl && !!message.mediaUrl.trim());

        let key = message._id ? message._id + message.role + message.mediaType
            : message._clientSent + message.role + message.mediaType;

        // if there is no messageId, message is not yet sent
        if (!message._id) {
            key = message._clientSent;
        }

        const hasContent = messageText || (message.actions && message.actions.filter(({type}) => !GLOBAL_ACTION_TYPES.includes(type)).length > 0);

        if (!(key in messagesHash) && hasContent) {
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

export default function ConversationReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case RESET:
        case ConversationActions.RESET_CONVERSATION:
            return {
                ...INITIAL_STATE
            };
        case ConversationActions.SET_CONVERSATION:
            return {
                ...action.conversation,
                messages: state.messages,
                replyActions: state.replyActions
            };
        case ConversationActions.SET_MESSAGES:
            return {
                ...state,
                messages: assignGroups(sortMessages(cleanUpMessages([...action.messages, ...preserveFailedMessages(state.messages)]))),
                replyActions: extractReplyActions(action.messages[action.messages.length - 1])
            };
        case ConversationActions.ADD_MESSAGES:
            return {
                ...state,
                messages: assignGroups(sortMessages(cleanUpMessages(action.append ?
                    [...state.messages, ...action.messages] :
                    [...action.messages, ...state.messages]
                ))),
                replyActions: extractReplyActions(action.messages[action.messages.length - 1])
            };
        case ConversationActions.ADD_MESSAGE:
            return Object.assign({}, state, {
                messages: addMessage(state.messages, action.message),
                replyActions: extractReplyActions(action.message)
            });
        case ConversationActions.REPLACE_MESSAGE:
            return Object.assign({}, state, {
                messages: assignGroups(sortMessages(replaceMessage(state.messages, action.queryProps, action.message)))
            });
        case ConversationActions.REMOVE_MESSAGE:
            return Object.assign({}, state, {
                messages: [...state.messages.filter((message) => !matchMessage(message, action.queryProps))],
                replyActions: state.messages[state.messages.length - 2] && extractReplyActions(state.messages[state.messages.length - 2])
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
