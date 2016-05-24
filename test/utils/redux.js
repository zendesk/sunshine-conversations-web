import thunkMiddleware from 'redux-thunk';
import configureStore from 'redux-mock-store';

const AppStore = require('stores/app-store');
const store = AppStore.store;

function restoreAppStore() {
    Object.defineProperty(AppStore, 'store', {
        get: () => {
            return store;
        }
    });
}

export function createMockedStore(sinon, mockedState = {}) {
    const middlewares = [thunkMiddleware];
    const mockStore = configureStore(middlewares);
    const store = mockStore(mockedState);

    sinon.spy(store, 'dispatch');
    store.restore = restoreAppStore;
    store.subscribe = sinon.spy(() => {
        return function() {};
    });
    return store;
}

export function mockAppStore(sinon, state) {
    var mockedStore = createMockedStore(sinon, state);

    Object.defineProperty(AppStore, 'store', {
        get: () => {
            return mockedStore;
        }
    });

    return mockedStore;
}
