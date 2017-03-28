import { ConversationReducer } from '../../../src/js/reducers/conversation-reducer';
import { ADD_MESSAGE, REPLACE_MESSAGE, RESET_CONVERSATION, REMOVE_MESSAGE, SET_CONVERSATION, RESET_UNREAD_COUNT, INCREMENT_UNREAD_COUNT, ADD_MESSAGES, SET_MESSAGES } from '../../../src/js/actions/conversation-actions';
import { SEND_STATUS } from '../../../src/js/constants/message';

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
const MESSAGES = [MESSAGE_1, MESSAGE_2];
const MESSAGE_FROM_APP_USER = {
    text: 'hey there!',
    role: 'appUser',
    received: 234.678,
    authorId: '8a9445dadad4862c2322db52',
    name: 'Calm Chimpanzee',
    _clientId: '123498001'
};
const MESSAGE_FROM_APP_MAKER_1 = {
    text: 'hello',
    role: 'appMaker',
    received: 823.4,
    authorId: '435nkglksdgf',
    name: 'Chloe',
    _id: '129381203'
};
const MESSAGE_FROM_APP_MAKER_2 = {
    text: 'hello2',
    role: 'appMaker',
    received: 823.5,
    authorId: '435nkglksdgf',
    name: 'Chloe',
    _id: 'sdgiuq4tct'
};
const MESSAGE_FROM_APP_MAKER_3 = {
    text: 'hello3',
    role: 'appMaker',
    received: 823.6,
    authorId: '435nkglksdgf',
    name: 'Chloe',
    _id: '234tvert'
};
const MESSAGES_FROM_APP_MAKER = [MESSAGE_FROM_APP_MAKER_1, MESSAGE_FROM_APP_MAKER_2, MESSAGE_FROM_APP_MAKER_3];
const MESSAGE_FROM_DIFFERENT_APP_MAKER = {
    text: 'message',
    role: 'appMaker',
    received: 834.5,
    authorId: 'differentauthorid1234',
    name: 'Not Chloe',
    _id: '23452346'
};

const UPLOADING_IMAGE_1 = {
    mediaUrl: 'data:image/jpeg',
    mediaType: 'image/jpeg',
    role: 'appUser',
    sendStatus: SEND_STATUS.SENDING,
    _clientId: 0.8288994217337065,
    _clientSent: Date.now() / 1000
};

const UPLOADING_IMAGE_2 = {
    mediaUrl: 'data:image/jpeg',
    mediaType: 'image/jpeg',
    role: 'appUser',
    sendStatus: SEND_STATUS.SENDING,
    _clientId: 0.901823905092145,
    _clientSent: Date.now() / 1000
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

const WHISPER_MESSAGE = {
    role: 'whisper',
    authorId: '123124214124.1242',
    name: 'Chloe',
    ruleId: '1234',
    text: 'Hey this is a whisper!',
    avatarUrl: 'avatar_url/',
    _id: '112351241cd1v5',
    received: 1234.567,
    source: {
        type: 'whisper'
    },
    actions: []
};

const REPLY_ACTION = {
    text: 'This is a reply!',
    role: 'appMaker',
    received: 1463682857.454,
    authorId: '8a9445dadad4862c2322db52',
    name: 'Calm Chimpanzee',
    actions: [{
        type: 'reply',
        label: 'Reply'
    }]
};

const EMPTY_REPLY_ACTION = {
    text: '',
    role: 'appMaker',
    received: 1463682857.454,
    authorId: '8a9445dadad4862c2322db52',
    name: 'Calm Chimpanzee',
    actions: [{
        type: 'reply',
        label: 'Reply'
    }]
};

const FAILED_MESSAGE = {
    text: 'FAILURE',
    role: 'appUser',
    authorId: '8a9445dadad4862c2322db52',
    name: 'Angry Pants',
    sendStatus: SEND_STATUS.FAILED,
    _clientId: '123498001'
};

const ACTIONS_ONLY_MESSAGE = {
    text: '',
    role: 'appMaker',
    received: 1463682857.454,
    authorId: '8a9445dadad4862c2322db52',
    name: 'Calm Chimpanzee',
    actions: [{
        type: 'link',
        label: 'Reply',
        uri: 'http://url.com'
    }, {
        type: 'link',
        label: 'Reply',
        uri: 'http://url.com'
    }, {
        type: 'link',
        label: 'Reply',
        uri: 'http://url.com'
    }]
};

describe('Conversation reducer', () => {

    describe('SET_CONVERSATION action', () => {
        it('should set state conversation with data from action', () => {
            const beforeState = {
                unreadCount: 0,
                hasMoreMessages: false
            };
            const afterState = ConversationReducer(beforeState, {
                type: SET_CONVERSATION,
                conversation: {
                    unreadCount: 1,
                    hasMoreMessages: true
                }
            });
            afterState.unreadCount.should.eq(1);
            afterState.hasMoreMessages.should.be.true;
        });
    });

    describe('ADD_MESSAGE action', () => {
        it('should add message', () => {
            const beforeState = INITIAL_STATE;
            const afterState = {
                messages: [MESSAGE_FROM_APP_USER],
                replyActions: [],
                unreadCount: 0,
                hasMoreMessages: false,
                isFetchingMoreMessagesFromServer: false
            };
            ConversationReducer(beforeState, {
                type: ADD_MESSAGE,
                message: MESSAGE_FROM_APP_USER
            }).should.eql(afterState);
        });

        it('should not add empty messages', () => {
            const beforeState = INITIAL_STATE;
            const afterState = ConversationReducer(beforeState, {
                type: ADD_MESSAGE,
                message: EMPTY_REPLY_ACTION
            });

            afterState.messages.should.eql(beforeState.messages);
        });

        it('should add reply actions if present', () => {
            const beforeState = INITIAL_STATE;
            const afterState = ConversationReducer(beforeState, {
                type: ADD_MESSAGE,
                message: REPLY_ACTION
            });

            afterState.replyActions.should.eql(REPLY_ACTION.actions);
        });

        it('should replace reply actions', () => {
            const beforeState = {
                ...INITIAL_STATE,
                replyActions: [{
                    type: 'reply',
                    label: 'Reply 1'
                }]
            };

            const afterState = {
                messages: [REPLY_ACTION],
                replyActions: REPLY_ACTION.actions,
                unreadCount: 0,
                hasMoreMessages: false,
                isFetchingMoreMessagesFromServer: false
            };
            ConversationReducer(beforeState, {
                type: ADD_MESSAGE,
                message: REPLY_ACTION
            }).should.eql(afterState);
        });

        it('should dismiss reply actions', () => {
            const beforeState = {
                ...INITIAL_STATE,
                replyActions: [{
                    type: 'reply'
                }]
            };

            const afterState = {
                messages: [MESSAGE_FROM_APP_USER],
                replyActions: [],
                unreadCount: 0,
                hasMoreMessages: false,
                isFetchingMoreMessagesFromServer: false
            };
            ConversationReducer(beforeState, {
                type: ADD_MESSAGE,
                message: MESSAGE_FROM_APP_USER
            }).should.eql(afterState);
        });

        it('should keep uploading image at the end of the messages array', () => {
            const beforeState = {
                messages: [MESSAGE_1, UPLOADING_IMAGE_1],
                unreadCount: 0
            };
            const afterState = ConversationReducer(beforeState, {
                type: ADD_MESSAGE,
                message: MESSAGE_FROM_APP_USER
            });
            afterState.messages.length.should.eq(3);
            afterState.messages[0].should.eql(MESSAGE_1);
            afterState.messages[1].should.eql(MESSAGE_FROM_APP_USER);
            afterState.messages[2].should.eql(UPLOADING_IMAGE_1);
        });

        it('should add appMaker message', () => {
            const beforeState = {
                messages: MESSAGES,
                unreadCount: 0
            };
            const afterState = ConversationReducer(beforeState, {
                type: ADD_MESSAGE,
                message: MESSAGE_FROM_APP_MAKER_1
            });
            afterState.messages.length.should.eq(3);
            afterState.messages[0].should.eql(MESSAGE_1);
            afterState.messages[1].should.eql(MESSAGE_2);
            afterState.messages[2].should.eql(MESSAGE_FROM_APP_MAKER_1);
        });

        it('should add multiple messages from same appMaker', () => {
            let state = INITIAL_STATE;
            MESSAGES_FROM_APP_MAKER.forEach((appMakerMessage) => {
                state = ConversationReducer(state, {
                    type: ADD_MESSAGE,
                    message: appMakerMessage
                });
            });
            state.messages.length.should.eq(3);
            state.messages[0].should.eql(MESSAGE_FROM_APP_MAKER_1);
            state.messages[1].should.eql(MESSAGE_FROM_APP_MAKER_2);
            state.messages[2].should.eql(MESSAGE_FROM_APP_MAKER_3);
        });

        it('should add messages from different appMakers', () => {
            const appMakerMessages = [MESSAGE_FROM_APP_MAKER_1, MESSAGE_FROM_DIFFERENT_APP_MAKER];
            let state = INITIAL_STATE;
            appMakerMessages.forEach((appMakerMessage) => {
                state = ConversationReducer(state, {
                    type: ADD_MESSAGE,
                    message: appMakerMessage
                });
            });
            state.messages.length.should.eq(2);
            state.messages[0].should.eql(MESSAGE_FROM_APP_MAKER_1);
            state.messages[1].should.eql(MESSAGE_FROM_DIFFERENT_APP_MAKER);
        });

        it('should add a whisper message', () => {
            const beforeState = INITIAL_STATE;
            const afterState = ConversationReducer(beforeState, {
                type: ADD_MESSAGE,
                message: WHISPER_MESSAGE,
                hasMoreMessages: false,
                isFetchingMoreMessagesFromServer: false
            });
            afterState.messages.length.should.eq(1);
            afterState.messages[0].should.eql(WHISPER_MESSAGE);
        });

        it('should add action only messages', () => {
            const beforeState = {
                messages: MESSAGES,
                unreadCount: 0
            };
            const afterState = ConversationReducer(beforeState, {
                type: ADD_MESSAGE,
                message: ACTIONS_ONLY_MESSAGE
            });
            afterState.messages.length.should.eq(3);
            afterState.messages[0].should.eql(MESSAGE_1);
            afterState.messages[1].should.eql(MESSAGE_2);
            afterState.messages[2].should.eql(ACTIONS_ONLY_MESSAGE);
        });
    });

    describe('REPLACE_MESSAGE action', () => {
        it('should replace uploading image with received image', () => {
            const beforeState = {
                messages: [MESSAGE_1, UPLOADING_IMAGE_1],
                unreadCount: 0
            };
            const afterState = ConversationReducer(beforeState, {
                type: REPLACE_MESSAGE,
                message: RECEIVED_IMAGE,
                queryProps: {
                    _clientId: UPLOADING_IMAGE_1._clientId
                }
            });
            afterState.messages.length.should.eq(2);
            afterState.messages[1].should.not.eql(UPLOADING_IMAGE_1);
            afterState.messages[1].should.eql({
                ...RECEIVED_IMAGE,
                _clientId: UPLOADING_IMAGE_1._clientId,
                firstInGroup: undefined,
                lastInGroup: true
            });
        });

        it('should not remove anything if message to be removed does not exist', () => {
            const beforeState = {
                messages: [MESSAGE_1, UPLOADING_IMAGE_1],
                unreadCount: 0
            };
            const afterState = ConversationReducer(beforeState, {
                type: REPLACE_MESSAGE,
                message: RECEIVED_IMAGE,
                queryProps: {
                    _clientId: 1234
                }
            });
            afterState.messages.length.should.eq(2);
            afterState.should.eql(beforeState);
        });

        it('should keep uploading images at bottom', () => {
            const beforeState = {
                messages: [UPLOADING_IMAGE_2, UPLOADING_IMAGE_1],
                unreadCount: 0
            };
            const afterState = ConversationReducer(beforeState, {
                type: REPLACE_MESSAGE,
                message: RECEIVED_IMAGE,
                queryProps: {
                    _clientId: UPLOADING_IMAGE_1._clientId
                }
            });
            afterState.messages.length.should.eq(2);
            afterState.messages[0].should.eql({
                ...RECEIVED_IMAGE,
                _clientId: UPLOADING_IMAGE_1._clientId,
                firstInGroup: true,
                lastInGroup: false
            });
            afterState.messages[1].should.eql(UPLOADING_IMAGE_2);
        });
    });

    describe('REMOVE_MESSAGE action', () => {
        it('should remove a message', () => {
            const beforeState = {
                messages: [MESSAGE_FROM_APP_USER],
                unreadCount: 0
            };
            const afterState = ConversationReducer(beforeState, {
                type: REMOVE_MESSAGE,
                queryProps: {
                    _clientId: MESSAGE_FROM_APP_USER._clientId
                }
            });
            afterState.messages.length.should.eq(0);
        });

        it('should remove a message and restore reply actions from previous', () => {
            const beforeState = {
                messages: [REPLY_ACTION, MESSAGE_FROM_APP_USER],
                unreadCount: 0
            };
            const afterState = ConversationReducer(beforeState, {
                type: REMOVE_MESSAGE,
                queryProps: {
                    _clientId: MESSAGE_FROM_APP_USER._clientId
                }
            });

            afterState.messages.length.should.eq(1);
            afterState.replyActions.should.eql(REPLY_ACTION.actions);
        });
    });

    describe('SET_MESSAGES action', () => {
        it('should set action messages to state', () => {
            const beforeState = INITIAL_STATE;
            const afterState = ConversationReducer(beforeState, {
                type: SET_MESSAGES,
                messages: MESSAGES
            });
            afterState.messages.should.eql(MESSAGES);
        });

        it('should not add duplicate messages', () => {
            const beforeState = INITIAL_STATE;
            const afterState = ConversationReducer(beforeState, {
                type: SET_MESSAGES,
                messages: [...MESSAGES, ...MESSAGES]
            });
            afterState.messages.should.eql(MESSAGES);
        });

        it('should not add empty messages', () => {
            const beforeState = INITIAL_STATE;
            const afterState = ConversationReducer(beforeState, {
                type: SET_MESSAGES,
                messages: [...MESSAGES, EMPTY_REPLY_ACTION]
            });
            afterState.messages.should.eql(MESSAGES);
        });

        it('should add reply actions if present', () => {
            const beforeState = INITIAL_STATE;
            const afterState = ConversationReducer(beforeState, {
                type: SET_MESSAGES,
                messages: [...MESSAGES, REPLY_ACTION]
            });

            afterState.replyActions.should.eql(REPLY_ACTION.actions);
        });

        it('should replace reply actions', () => {
            const beforeState = {
                ...INITIAL_STATE,
                replyActions: [{
                    type: 'reply',
                    label: 'Reply 1'
                }]
            };

            const afterState = {
                messages: [REPLY_ACTION],
                replyActions: REPLY_ACTION.actions,
                unreadCount: 0,
                hasMoreMessages: false,
                isFetchingMoreMessagesFromServer: false
            };
            ConversationReducer(beforeState, {
                type: SET_MESSAGES,
                messages: [REPLY_ACTION]
            }).should.eql(afterState);
        });

        it('should dismiss reply actions', () => {
            const beforeState = {
                ...INITIAL_STATE,
                replyActions: [{
                    type: 'reply'
                }]
            };

            const afterState = {
                messages: [MESSAGE_FROM_APP_USER],
                replyActions: [],
                unreadCount: 0,
                hasMoreMessages: false,
                isFetchingMoreMessagesFromServer: false
            };
            ConversationReducer(beforeState, {
                type: SET_MESSAGES,
                messages: [MESSAGE_FROM_APP_USER]
            }).should.eql(afterState);
        });

        it('should preserve failed messages that were in the state', () => {
            const beforeState = {
                ...INITIAL_STATE,
                messages: [FAILED_MESSAGE]
            };
            const afterState = ConversationReducer(beforeState, {
                type: SET_MESSAGES,
                messages: MESSAGES
            });
            afterState.messages.should.eql([...MESSAGES, FAILED_MESSAGE]);
        });

        it('should add action only messages', () => {
            const beforeState = INITIAL_STATE;
            const afterState = ConversationReducer(beforeState, {
                type: SET_MESSAGES,
                messages: [...MESSAGES, ACTIONS_ONLY_MESSAGE]
            });
            afterState.messages.length.should.eq(3);
            afterState.messages[0].should.eql(MESSAGE_1);
            afterState.messages[1].should.eql(MESSAGE_2);
            afterState.messages[2].should.eql(ACTIONS_ONLY_MESSAGE);
        });
    });

    describe('ADD_MESSAGES action', () => {
        [true, false].forEach((shouldAppend) => {
            describe(`append option is set to ${shouldAppend}`, () => {
                it(`should add messages to the ${shouldAppend ? 'end' : 'beginning'} of the state messages`, () => {
                    const beforeState = {
                        messages: [MESSAGE_1]
                    };
                    const afterState = ConversationReducer(beforeState, {
                        type: ADD_MESSAGES,
                        messages: [MESSAGE_2],
                        append: shouldAppend
                    });
                    const messages = shouldAppend ? [MESSAGE_1, MESSAGE_2] : [MESSAGE_1, MESSAGE_2];
                    afterState.messages.should.eql(messages);
                });

                it('should not add empty messages', () => {
                    const beforeState = INITIAL_STATE;
                    const afterState = ConversationReducer(beforeState, {
                        type: ADD_MESSAGES,
                        append: shouldAppend,
                        messages: [EMPTY_REPLY_ACTION]
                    });
                    afterState.messages.should.eql(beforeState.messages);
                });

                it('should add reply actions if present', () => {
                    const beforeState = INITIAL_STATE;
                    const afterState = ConversationReducer(beforeState, {
                        type: ADD_MESSAGES,
                        messages: [REPLY_ACTION],
                        append: shouldAppend
                    });

                    afterState.replyActions.should.eql(REPLY_ACTION.actions);
                });

                it('should replace reply actions', () => {
                    const beforeState = {
                        ...INITIAL_STATE,
                        replyActions: [{
                            type: 'reply',
                            label: 'Reply 1'
                        }]
                    };

                    const afterState = {
                        messages: [REPLY_ACTION],
                        replyActions: REPLY_ACTION.actions,
                        unreadCount: 0,
                        hasMoreMessages: false,
                        isFetchingMoreMessagesFromServer: false
                    };
                    ConversationReducer(beforeState, {
                        type: ADD_MESSAGES,
                        messages: [REPLY_ACTION],
                        shouldAppend
                    }).should.eql(afterState);
                });

                it('should dismiss reply actions', () => {
                    const beforeState = {
                        ...INITIAL_STATE,
                        replyActions: [{
                            type: 'reply'
                        }]
                    };

                    const afterState = {
                        messages: [MESSAGE_FROM_APP_USER],
                        replyActions: [],
                        unreadCount: 0,
                        hasMoreMessages: false,
                        isFetchingMoreMessagesFromServer: false
                    };
                    ConversationReducer(beforeState, {
                        type: ADD_MESSAGES,
                        messages: [MESSAGE_FROM_APP_USER]
                    }).should.eql(afterState);
                });
            });
        });

        it('should not add duplicates', () => {
            const beforeState = {
                messages: [MESSAGE_1]
            };
            const afterState = ConversationReducer(beforeState, {
                type: ADD_MESSAGES,
                messages: [MESSAGE_1],
                append: true
            });
            afterState.messages.length.should.eq(1);
            afterState.messages[0].should.eq(MESSAGE_1);
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
            replyActions: [],
            unreadCount: 1,
            hasMoreMessages: false,
            isFetchingMoreMessagesFromServer: false
        };
        ConversationReducer(beforeState, {
            type: INCREMENT_UNREAD_COUNT
        }).should.eql(afterState);
    });

    it('should reset unread count on RESET_UNREAD_COUNT', () => {
        const beforeState = {
            messages: [],
            replyActions: [],
            unreadCount: 100,
            hasMoreMessages: false,
            isFetchingMoreMessagesFromServer: false
        };
        const afterState = INITIAL_STATE;
        ConversationReducer(beforeState, {
            type: RESET_UNREAD_COUNT
        }).should.eql(afterState);
    });
});
