import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';

import RootReducer from '../reducers/root';

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware,
)(createStore);

export function configureStore(initialState) {
    return createStoreWithMiddleware(RootReducer, initialState);
}
