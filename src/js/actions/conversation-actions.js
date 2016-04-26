export const ADD_MESSAGE = 'ADD_MESSAGE';
export const REMOVE_MESSAGE = 'REMOVE_MESSAGE';
export const RESET_CONVERSATION = 'RESET_CONVERSATION';
export const SET_CONVERSATION = 'SET_CONVERSATION';
export const RESET_UNREAD_COUNT = 'RESET_UNREAD_COUNT';
export const INCREMENT_UNREAD_COUNT = 'INCREMENT_UNREAD_COUNT';

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

export function addMessage(props) {
    return {
        type: ADD_MESSAGE,
        message: Object.assign({
            actions: []
        }, props)
    };
}

export function removeMessage(props) {
    return {
        type: REMOVE_MESSAGE,
        id: props.id
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
