import sinon from 'sinon';
import { Smooch } from 'smooch.jsx';


describe('Smooch', () => {
    const sandbox = sinon.sandbox.create();
    const smooch = new Smooch();
    var appendChildStub;
    beforeEach(() => {
        sandbox.stub(document.body, 'appendChild');
        sandbox.stub(document, 'addEventListener', (eventName, cb) => {
            if (eventName === 'DOMContentLoaded') {
                cb();
            }
        });

        delete smooch.appToken;
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('Init', () => {
        var loginStub;

        beforeEach(() => {
            loginStub = sandbox.stub(smooch, 'login');
        });

        it('should call login', () => {
            const props = {
                userId: 'some-id',
                appToken: 'some-token',
                jwt: 'some-jwt'
            };

            smooch.init(props);

            smooch.appToken.should.eq(props.appToken);
            loginStub.should.have.been.calledWith(props.userId, props.jwt, props);
        });


    });

});
