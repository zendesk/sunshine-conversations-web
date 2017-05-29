import { applyMiddleware, createStore, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

import { RootReducer } from '../reducers/root-reducer';

const finalCreateStore = compose(
    applyMiddleware(thunkMiddleware),
    parent.window.devToolsExtension ? parent.window.devToolsExtension() : (f) => f
)(createStore);

export function configureStore(initialState) {
    const store = finalCreateStore(RootReducer, initialState);

    if (module.hot) {
        module.hot.accept('../reducers/root-reducer', () => store.replaceReducer(require('../reducers/root-reducer').RootReducer));
    }

    return store;
}
