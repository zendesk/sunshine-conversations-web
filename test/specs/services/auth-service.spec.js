import sinon from 'sinon';
import { getMock } from 'test/mocks/core';
import * as coreService from 'services/core';
import { login } from 'services/auth-service';

describe('Auth service', () => {
    var sandbox;
    var coreMock;
    var coreStub;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(() => {
        coreMock = getMock(sandbox);
        coreStub = sandbox.stub(coreService, 'core', () => {
            return coreMock;
        });

        coreMock.appUsers.init.resolves();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('login', () => {
        it('should call smooch-core init api', () => {
            let props = {
                id: 'some-id'
            };

            return login(props).then(() => {
                coreMock.appUsers.init.should.have.been.calledWith(props);
            });
        });
    });
});
