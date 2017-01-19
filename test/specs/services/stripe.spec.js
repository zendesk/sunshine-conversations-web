import sinon from 'sinon';

import { createMock } from '../../mocks/core';
import { createMockedStore } from '../../utils/redux';

import * as coreService from '../../../src/js/services/core';
import { createTransaction, getAccount } from '../../../src/js/services/stripe';

describe('Stripe service', () => {
    var sandbox;
    var coreMock;
    let mockedStore;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(() => {
        mockedStore = createMockedStore(sandbox, {
            user: {
                _id: '1'
            }
        });

        coreMock = createMock(sandbox);
        sandbox.stub(coreService, 'core', () => {
            return coreMock;
        });
        coreMock.appUsers.stripe.createTransaction.resolves();
        coreMock.stripe.getAccount.resolves();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('createTransaction', () => {
        it('should call smooch-core appUser stripe api', () => {
            return mockedStore.dispatch(createTransaction('actionId', 'token')).then(() => {
                coreMock.appUsers.stripe.createTransaction.should.have.been.calledWith('1', 'actionId', 'token');
            });
        });
    });

    describe('getAccount', () => {
        it('should call smooch-core stripe api', () => {
            return mockedStore.dispatch(getAccount()).then(() => {
                coreMock.stripe.getAccount.should.have.been.calledOnce;
            });
        });
    });
});
