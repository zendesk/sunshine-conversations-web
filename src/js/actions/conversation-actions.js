export const ADD_MESSAGE = 'ADD_MESSAGE';
export const ADD_MESSAGES = 'ADD_MESSAGES';
export const REPLACE_MESSAGE = 'REPLACE_MESSAGE';
export const REMOVE_MESSAGE = 'REMOVE_MESSAGE';
export const RESET_CONVERSATION = 'RESET_CONVERSATION';
export const SET_CONVERSATION = 'SET_CONVERSATION';
export const SET_MESSAGES = 'SET_MESSAGES';
export const RESET_UNREAD_COUNT = 'RESET_UNREAD_COUNT';
export const INCREMENT_UNREAD_COUNT = 'INCREMENT_UNREAD_COUNT';
export const SET_FETCHING_MORE_MESSAGES_FROM_SERVER = 'SET_FETCHING_MORE_MESSAGES_FROM_SERVER';

export function resetConversation() {
    return {
        type: RESET_CONVERSATION
    };
}

export function setConversation(props) {
    return {
        type: SET_CONVERSATION,
        conversation: props
    };
}

export function setMessages(messages) {
    return {
        type: SET_MESSAGES,
        messages
    };
}

export function addMessage(props) {
    return {
        type: ADD_MESSAGE,
        message: {
            ...props
        }
    };
}

export function addMessages(messages, append = true) {
    return {
        type: ADD_MESSAGES,
        messages,
        append
    };
}

export function replaceMessage(queryProps, message) {
    return {
        type: REPLACE_MESSAGE,
        queryProps,
        message
    };
}

export function removeMessage(queryProps) {
    return {
        type: REMOVE_MESSAGE,
        queryProps
    };
}

export function incrementUnreadCount() {
    return {
        type: INCREMENT_UNREAD_COUNT
    };
}

export function resetUnreadCount() {
    return {
        type: RESET_UNREAD_COUNT
    };
}

export function setFetchingMoreMessagesFromServer(value) {
    return {
        type: SET_FETCHING_MORE_MESSAGES_FROM_SERVER,
        value
    };
}
