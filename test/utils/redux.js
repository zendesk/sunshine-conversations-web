import thunkMiddleware from 'redux-thunk';
import configureStore from 'redux-mock-store';

export function generateBaseStoreProps() {
    return {
        ui: {
            text: {}
        },
        app: {
            integrations: []
        },
        integrations: {},
        user: {
            _id: '1234'
        },
        appState: {
            visibleChannelType: null
        }
    };
}

export function createMockedStore(sinon, mockedState = {}) {
    const middlewares = [thunkMiddleware];
    const mockStore = configureStore(middlewares);
    const store = mockStore(mockedState);

    sinon.spy(store, 'dispatch');
    store.subscribe = sinon.spy(() => {
        return function() {};
    });
    return store;
}
