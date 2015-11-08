export const MESSAGE_ADDED = 'MESSAGE_ADDED';
export const MESSAGES_CLEARED = 'MESSAGES_CLEARED';

export function messageReceived(props) {
  return {
    type: MESSAGE_ADDED,
    message: props
  };
}

export function messagesCleared() {
  return {
    type: MESSAGES_CLEARED
  };
}
