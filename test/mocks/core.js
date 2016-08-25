export function createMock(sinon) {
    var mock = {
        appUsers: {
            init: sinon.stub(),
            update: sinon.stub(),
            trackEvent: sinon.stub(),
            stripe: {
                createTransaction: sinon.stub()
            },
            updateDevice: sinon.stub(),
            linkChannel: sinon.stub(),
            unlinkChannel: sinon.stub(),
            pingChannel: sinon.stub(),
            getMessages: sinon.stub(),
            sendMessage: sinon.stub(),
            uploadImage: sinon.stub()
        },

        conversations: {
            resetUnreadCount: sinon.stub(),
            postPostback: sinon.stub()
        },

        stripe: {
            getAccount: sinon.stub()
        }
    };

    return mock;
}
