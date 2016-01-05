import { createStore, applyMiddleware } from 'redux';
import { RootReducer } from 'reducers/root-reducer';
import { firstMessage } from 'stores/middlewares/messages';

const finalCreateStore = applyMiddleware(firstMessage)(createStore);

export function configureStore(initialState) {
    return finalCreateStore(RootReducer, initialState);
}
