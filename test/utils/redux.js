import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';

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
    const createStoreWithMiddleware = compose(
        applyMiddleware(thunkMiddleware)
    )(createStore);

    const store = createStoreWithMiddleware(() => mockedState);

    sinon.spy(store, 'dispatch');
    store.restore = restoreAppStore;
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
