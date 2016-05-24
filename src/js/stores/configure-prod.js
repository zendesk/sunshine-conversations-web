import { createStore } from 'redux';
import { RootReducer } from 'reducers/root-reducer';

export function configureStore(initialState) {
    return createStore(RootReducer, initialState);
}
