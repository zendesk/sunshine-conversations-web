import sinon from 'sinon';
import { getMock } from 'test/mocks/core';
import { getMockedStore } from 'test/utils/redux';
import * as coreService from 'services/core';
import * as appStore from 'stores/app-store';

import { immediateUpdate, update, trackEvent } from 'services/user-service';


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

describe('User service', () => {
    var sandbox;
    var coreMock;
    var coreStub;
    var mockedStore;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    after(() => {
        Object.defineProperty(AppStore, 'store', {
            get: () => {
                return store;
            }
        });
    });

    beforeEach(() => {
        coreMock = getMock(sandbox);

        coreMock.appUsers.update.resolves({
            appUser: {
                _id: '1',
                email: 'mocked@email.com'
            }
        });

        coreStub = sandbox.stub(coreService, 'core', () => {
            return coreMock;
        });

        mockedStore = mockStore(sandbox, {
            user: {
                _id: '1'
            }
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('immediateUpdate', () => {
        it('should call smooch-core update api and update the store on server response', () => {
            let props = {
                email: 'some@email.com'
            };

            return immediateUpdate(props).then((response) => {
                coreMock.appUsers.update.should.have.been.calledWith('1', {
                    email: 'some@email.com'
                });

                // the values here are different because these are values
                // returned by the server and mocked in the beforeEach
                response.should.deep.eq({
                    appUser: {
                        _id: '1',
                        email: 'mocked@email.com'
                    }
                });
                mockedStore.dispatch.should.have.been.calledWith({
                    type: 'SET_USER',
                    user: {
                        _id: '1',
                        email: 'mocked@email.com'
                    }
                });
            });
        });
    });
});
