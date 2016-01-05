export const ADD_MESSAGE = 'ADD_MESSAGE';
export const MESSAGES_CLEARED = 'MESSAGES_CLEARED';
export const SET_CONVERSATION = 'SET_CONVERSATION';
export const RESET_CONVERSATION = 'RESET_CONVERSATION';

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
            _id: Math.random(),
            actions: []
        }, props)
    };
}

export function messagesCleared() {
    return {
        type: MESSAGES_CLEARED
    };
}
