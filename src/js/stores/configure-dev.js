import { createStore, compose } from 'redux';
import { RootReducer } from 'reducers/root-reducer';
import { DevTools } from 'components/dev-tools';

const finalCreateStore = compose(
    DevTools.instrument()
)(createStore);

export function configureStore(initialState) {
    const store = finalCreateStore(RootReducer, initialState);

    if (module.hot) {
        module.hot.accept('reducers/root-reducer', () => store.replaceReducer(require('reducers/root-reducer').RootReducer)
        );
    }

    return store;
}
