import { store } from 'stores/app-store';
import * as AppStateActions from 'actions/app-state-actions';
import { observable } from 'utils/events';


export function openWidget() {
    let {embedded} = store.getState().appState;
    if (!embedded) {
        store.dispatch(AppStateActions.openWidget());
        observable.trigger('widget:opened');
    }
}

export function closeWidget() {
    let {embedded} = store.getState().appState;
    if (!embedded) {
        store.dispatch(AppStateActions.closeWidget());
        observable.trigger('widget:closed');
    }
}


export function toggleWidget() {
    let {embedded, widgetOpened} = store.getState().appState;
    if (!embedded) {
        store.dispatch(AppStateActions.toggleWidget());
        
        if (widgetOpened) {
            observable.trigger('widget:closed');
        } else {
            observable.trigger('widget:opened');
        }
    }
}
