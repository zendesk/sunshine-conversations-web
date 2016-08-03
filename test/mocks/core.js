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
            pingChannel: sinon.stub()
        },

        conversations: {
            sendMessage: sinon.stub(),
            get: sinon.stub(),
            uploadImage: sinon.stub(),
            resetUnreadCount: sinon.stub(),
            postPostback: sinon.stub()
        },

        stripe: {
            getAccount: sinon.stub()
        }
    };

    return mock;
}
