export function getMock(sinon) {
    var mock = {
        appUsers: {
            init: sinon.stub(),
            update: sinon.stub(),
            trackEvent: sinon.stub()
        },
        conversations: {
            sendMessage: sinon.stub(),
            get: sinon.stub()
        }
    };

    return mock;
}
