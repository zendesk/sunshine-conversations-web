import sinon from 'sinon';

import { createMock } from '../../mocks/core';
import { createMockedStore } from '../../utils/redux';
import * as coreService from '../../../src/js/services/core';
import { login } from '../../../src/js/services/auth';

describe('Auth service', () => {
    let mockedStore;
    let sandbox;
    let coreMock;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(() => {
        coreMock = createMock(sandbox);
        sandbox.stub(coreService, 'core', () => {
            return coreMock;
        });
        coreMock.appUsers.init.resolves();
        mockedStore = createMockedStore(sandbox);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('login', () => {
        it('should call smooch-core init api', () => {
            const props = {
                id: 'some-id'
            };

            return mockedStore.dispatch(login(props)).then(() => {
                coreMock.appUsers.init.should.have.been.calledWith(props);
            });
        });
    });
});
