import { createStore } from 'redux';

export function getMockedStore(sinon, mockedState = {}) {
    const store = createStore((state, action) => mockedState);

    sinon.spy(store, 'dispatch');
    return store;
}
