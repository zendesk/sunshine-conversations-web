import { ConversationReducer } from 'reducers/conversation-reducer';
import { ADD_MESSAGE, REPLACE_MESSAGE, REMOVE_MESSAGE, RESET_CONVERSATION, SET_CONVERSATION, RESET_UNREAD_COUNT, INCREMENT_UNREAD_COUNT } from 'actions/conversation-actions';

const INITIAL_STATE = ConversationReducer(undefined, {});
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
const MESSAGE_TO_ADD = {
    text: 'hey there!',
    role: 'appUser',
    received: 234.678,
    authorId: '8a9445dadad4862c2322db52',
    name: 'Calm Chimpanzee',
    _tempId: '123498001'
};
const MESSAGES = [MESSAGE_1, MESSAGE_2];
const UPLOADING_IMAGE = {
    mediaUrl: 'data:image/jpeg',
    mediaType: 'image/jpeg',
    role: 'appUser',
    status: 'sending',
    _tempId: 0.8288994217337065,
    _tempSent: '2016-05-19T18:33:10.788Z'
};
const RECEIVED_IMAGE = {
    text: 'some_media_url',
    mediaType: 'image/jpeg',
    mediaUrl: 'some_media_url',
    role: 'appUser',
    received: 1463682757.454,
    authorId: '8a9445dadad4862c2322db52',
    name: 'Calm Chimpanzee',
    _id: '573e06c550a52d2900f907c6'
};

describe('Conversation reducer', () => {

    describe('SET_CONVERSATION action', () => {
        it('should merge state and stores messages', () => {
            const beforeState = {
                unreadCount: 5,
                messages: [MESSAGE_1]
            };
            const afterState = ConversationReducer(beforeState, {
                type: SET_CONVERSATION,
                conversation: {
                    messages: [MESSAGE_2],
                    appUsers: [],
                    appMakers: []
                }
            });
            afterState.messages.length.should.eq(2);
            afterState.messages.should.contain(MESSAGE_1);
            afterState.messages.should.contain(MESSAGE_2);
        });

        it('should not add a duplicate message', () => {
            const beforeState = {
                unreadCount: 4,
                messages: MESSAGES
            };
            const afterState = ConversationReducer(beforeState, {
                type: SET_CONVERSATION,
                conversation: {
                    messages: [MESSAGE_1],
                    appUsers: [],
                    appMakers: []
                }
            });
            afterState.messages.length.should.eq(2);
            afterState.messages.should.eql(MESSAGES);
        });
    });

    describe('ADD_MESSAGE action', () => {
        it('should add message', () => {
            const beforeState = INITIAL_STATE;
            const afterState = {
                messages: [MESSAGE_TO_ADD],
                unreadCount: 0
            };
            ConversationReducer(beforeState, {
                type: ADD_MESSAGE,
                message: MESSAGE_TO_ADD
            }).should.eql(afterState);
        });

        it('should keep uploading image at the end of the messages array', () => {
            const beforeState = {
                messages: [MESSAGE_1, UPLOADING_IMAGE],
                unreadCount: 0
            };
            const afterState = ConversationReducer(beforeState, {
                type: ADD_MESSAGE,
                message: MESSAGE_TO_ADD
            });
            afterState.messages.length.should.eq(3);
            afterState.messages[0].should.eql(MESSAGE_1);
            afterState.messages[1].should.eql(MESSAGE_TO_ADD);
            afterState.messages[2].should.eql(UPLOADING_IMAGE);
        });
    });

    describe('REPLACE_MESSAGE action', () => {
        it('should replace uploading image with received image', () => {
            const beforeState = {
                messages: [MESSAGE_1, UPLOADING_IMAGE],
                unreadCount: 0
            };
            const afterState = ConversationReducer(beforeState, {
                type: REPLACE_MESSAGE,
                message: RECEIVED_IMAGE,
                queryProps: {
                    _tempId: UPLOADING_IMAGE._tempId
                }
            });
            afterState.messages.length.should.eq(2);
            afterState.messages[1].should.not.eql(UPLOADING_IMAGE);
            afterState.messages[1].should.eql(RECEIVED_IMAGE);
        });

        it('should not remove anything if message to be removed does not exist', () => {
            const beforeState = {
                messages: [MESSAGE_1, UPLOADING_IMAGE],
                unreadCount: 0
            };
            const afterState = ConversationReducer(beforeState, {
                type: REPLACE_MESSAGE,
                message: RECEIVED_IMAGE,
                queryProps: {
                    _tempId: 1234
                }
            });
            afterState.messages.length.should.eq(2);
            afterState.should.eql(beforeState);
        });
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
