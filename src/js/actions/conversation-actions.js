export const MESSAGE_ADDED = 'MESSAGE_ADDED';
export const MESSAGES_CLEARED = 'MESSAGES_CLEARED';
export const SET_CONVERSATION = 'SET_CONVERSATION';

export function setConversation(props) {
  return {
    type: SET_CONVERSATION,
    conversation: props
  }
}

export function messageAdded(props) {
  return {
    type: MESSAGE_ADDED,
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
