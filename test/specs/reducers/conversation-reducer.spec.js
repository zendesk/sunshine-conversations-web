import { ConversationReducer } from 'reducers/conversation-reducer';
import { ADD_MESSAGE, REPLACE_MESSAGE, REMOVE_MESSAGE, RESET_CONVERSATION, SET_CONVERSATION, RESET_UNREAD_COUNT, INCREMENT_UNREAD_COUNT } from 'actions/conversation-actions';

const INITIAL_STATE = {
    messages: [],
    unreadCount: 0
};
const MESSAGE_1 = {
    text: 'hi!',
    role: 'appUser',
    received: 123.456,
    authorId: '8a9445dadad4862c2322db52',
    name: 'Calm Chimpanzee',
    _id: '123456'
};
const MESSAGE_2 = {
    text: 'hello',
    role: 'appUser',
    received: 789.101,
    authorId: '8a9445dadad4862c2322db52',
    name: 'Calm Chimpanzee',
    _id: '789101'
};
const MESSAGES = [MESSAGE_1, MESSAGE_2];

describe('Conversation reducer', () => {
    it('should have no messages initially', () => {
        Object.keys(ConversationReducer(undefined, {})).length.should.eq(2);
        ConversationReducer(undefined, {}).messages.length.should.eq(0);
        ConversationReducer(undefined, {}).unreadCount.should.eq(0);
    });

    it('should set to initial state on RESET_CONVERSATION', () => {
        const beforeState = {
            unreadCount: 123,
            messages: MESSAGES
        };
        const afterState = INITIAL_STATE;
        ConversationReducer(beforeState, {
            type: RESET_CONVERSATION
        }).should.eql(afterState);
    });

    it('should add message on ADD_MESSAGES', () => {
        const beforeState = INITIAL_STATE;
        const afterState = {
            messages: [MESSAGE_1],
            unreadCount: 0
        };
        ConversationReducer(beforeState, {
            type: ADD_MESSAGE,
            message: MESSAGE_1
        }).should.eql(afterState);
    });

    it('should increment unread count on INCREMENT_UNREAD_COUNT', () => {
        const beforeState = INITIAL_STATE;
        const afterState = {
            messages: [],
            unreadCount: 1
        };
        ConversationReducer(beforeState, {
            type: INCREMENT_UNREAD_COUNT
        }).should.eql(afterState);
    });

    it('should reset unread count on RESET_UNREAD_COUNT', () => {
        const beforeState = {
            messages: [],
            unreadCount: 100
        };
        const afterState = INITIAL_STATE;
        ConversationReducer(beforeState, {
            type: RESET_UNREAD_COUNT
        }).should.eql(afterState);
    });
});
