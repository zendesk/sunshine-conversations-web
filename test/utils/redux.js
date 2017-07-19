import thunkMiddleware from 'redux-thunk';
import configureStore from 'redux-mock-store';

export function generateBaseStoreProps(extraProps = {}) {
    return {
        ...extraProps,
        ui: {
            text: {},
            ...extraProps.ui
        },
        conversation: {
            messages: [],
            ...extraProps.conversation
        },
        auth: {
            ...extraProps.auth
        },
        integrations: {
            ...extraProps.integrations
        },
        user: {
            ...extraProps.user
        },
        appState: {
            isInitialized: false,
            visibleChannelType: null,
            ...extraProps.appState
        },
        config: {
            appId: 'some-app-id',
            apiBaseUrl: 'http://localhost',
            configBaseUrl: 'http://localhost',
            style: {},
            ...extraProps.config
        },
        faye: {
            userSubscription: null,
            conversationSubscription: null
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

export function findActionsByType(actions, type) {
    const foundActions = [];

    for (const action of actions) {
        if (action.type === type) {
            foundActions.push(action);
        } else if (action.type === 'BATCHING_REDUCER.BATCH') {
            for (const batchedAction of action.payload) {
                if (batchedAction.type === type) {
                    foundActions.push(batchedAction);
                }
            }
        }
    }

    return foundActions;
}
