export function getMock(sinon) {
    return {
        appUsers: {
            init: sinon.stub(),
            update: sinon.stub(),
            trackEvent: sinon.stub()
        },
        conversations: {
            sendMessage: sinon.stub(),
            get: sinon.stub()
        }
    }
}
