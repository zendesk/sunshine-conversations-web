import sinon from 'sinon';

import { createMockedStore } from '../../utils/redux';
import { login, __Rewire__ as AuthRewire } from '../../../src/frame/js/actions/auth';

describe('Auth Actions', () => {
    let mockedStore;
    let sandbox;
    let httpStub;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(() => {
        httpStub = sandbox.stub().returnsAsyncThunk();
        AuthRewire('http', httpStub);
        mockedStore = createMockedStore(sandbox);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('login', () => {
        it('should call login api', () => {
            const props = {
                id: 'some-id'
            };

            return mockedStore.dispatch(login(props)).then(() => {
                httpStub.should.have.been.calledWith('POST', `/apps/${mockedStore.getState().config.appId}/login`, props);
            });
        });
    });
});
