import sinon from 'sinon';
import { getMock } from 'test/mocks/core';
import { getMockedStore } from 'test/utils/redux';
import * as coreService from 'services/core';
import { createTransaction, getAccount } from 'services/stripe-service';

const AppStore = require('stores/app-store');

const store = AppStore.store;

function mockStore(s, state = {}) {
    var mockedStore = getMockedStore(s, state);

    Object.defineProperty(AppStore, 'store', {
        get: () => {
            return mockedStore;
        }
    });

    return mockedStore;
}

describe('Stripe service', () => {
    var sandbox;
    var coreMock;
    var coreStub;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(() => {
        mockStore(sandbox, {
            user: {
                _id: '1'
            }
        });

        coreMock = getMock(sandbox);
        coreStub = sandbox.stub(coreService, 'core', () => {
            return coreMock;
        });
        coreMock.appUsers.stripe.createTransaction.resolves();
        coreMock.stripe.getAccount.resolves();
    });

    afterEach(() => {
        sandbox.restore();
        Object.defineProperty(AppStore, 'store', {
            get: () => {
                return store;
            }
        });
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
