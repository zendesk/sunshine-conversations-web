import { createStore } from 'redux';

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
    const store = createStore(() => mockedState);

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
