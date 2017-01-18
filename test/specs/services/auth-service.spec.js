import sinon from 'sinon';

import { createMock } from '../../mocks/core';
import * as coreService from '../../../src/js/services/core';
import { login } from '../../../src/js/services/auth';

describe('Auth service', () => {
    var sandbox;
    var coreMock;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(() => {
        coreMock = createMock(sandbox);
        sandbox.stub(coreService, 'core', () => {
            return coreMock;
        });
        coreMock.appUsers.init.resolves();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('login', () => {
        it('should call smooch-core init api', () => {
            const props = {
                id: 'some-id'
            };

            return login(props).then(() => {
                coreMock.appUsers.init.should.have.been.calledWith(props);
            });
        });
    });
});
