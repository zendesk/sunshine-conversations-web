import sinon from 'sinon';

import { createMockedStore, generateBaseStoreProps } from '../../utils/redux';

import { createTransaction, __Rewire__ as StripeRewire } from '../../../src/frame/js/actions/stripe';

describe('Stripe Actions', () => {
    let sandbox;
    let mockedStore;
    let httpStub;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(() => {
        mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
            user: {
                _id: '1'
            }
        }));
        httpStub = sandbox.stub().returnsAsyncThunk();
        StripeRewire('http', httpStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('createTransaction', () => {
        it('should call stripe api endpoint', () => {
            const {config: {appId}, user: {_id}} = mockedStore.getState();
            return mockedStore.dispatch(createTransaction('actionId', 'token')).then(() => {
                httpStub.should.have.been.calledWith('POST', `/apps/${appId}/appusers/${_id}/stripe/transaction`, {
                    actionId: 'actionId',
                    token: 'token'
                });
            });
        });
    });
});
