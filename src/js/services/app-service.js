import { store } from 'stores/app-store';
import * as AppStateActions from 'actions/app-state-actions';
import { observable } from 'utils/events';

import { preventMobilePageScroll, allowMobilePageScroll } from 'utils/dom';


export function openWidget() {
    let {embedded} = store.getState().appState;
    if (!embedded) {
        store.dispatch(AppStateActions.openWidget());
        observable.trigger('widget:opened');

        preventMobilePageScroll();
    }
}

export function closeWidget() {
    let {embedded} = store.getState().appState;
    if (!embedded) {
        store.dispatch(AppStateActions.closeWidget());
        observable.trigger('widget:closed');

        allowMobilePageScroll();
    }
}


export function toggleWidget() {
    let {embedded, widgetOpened} = store.getState().appState;
    if (!embedded) {
        if (widgetOpened) {
            closeWidget();
        } else {
            openWidget();
        }
    }
}
