export const MESSAGE_ADDED = 'MESSAGE_ADDED';
export const MESSAGES_CLEARED = 'MESSAGES_CLEARED';

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
