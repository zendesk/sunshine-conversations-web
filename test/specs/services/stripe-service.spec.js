import sinon from 'sinon';
import { createMock } from 'test/mocks/core';
import { mockAppStore } from 'test/utils/redux';
import * as coreService from 'services/core';
import { createTransaction, getAccount } from 'services/stripe-service';

describe('Stripe service', () => {
    var sandbox;
    var coreMock;
    let mockedStore;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(() => {
        mockedStore = mockAppStore(sandbox, {
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
        mockedStore.restore();
    });

    describe('createTransaction', () => {
        it('should call smooch-core appUser stripe api', () => {
            return createTransaction('actionId', 'token').then(() => {
                coreMock.appUsers.stripe.createTransaction.should.have.been.calledWith('1', 'actionId', 'token');
            });
        });
    });

    describe('getAccount', () => {
        it('should call smooch-core stripe api', () => {
            return getAccount().then(() => {
                coreMock.stripe.getAccount.should.have.been.calledOnce;
            });
        });
    });
});
