import { store } from 'stores/app-store';
import * as AppStateActions from 'actions/app-state-actions';
import { observable } from 'utils/events';
import { preventMobilePageScroll, allowMobilePageScroll } from 'utils/dom';
import { resetUnreadCount } from 'services/conversation-service';



export function openWidget() {
    const {embedded} = store.getState().appState;
    if (!embedded) {
        store.dispatch(AppStateActions.openWidget());
        observable.trigger('widget:opened');
        resetUnreadCount();
        preventMobilePageScroll();
    }
}

export function closeWidget() {
    const {embedded} = store.getState().appState;
    if (!embedded) {
        store.dispatch(AppStateActions.closeWidget());
        observable.trigger('widget:closed');
        resetUnreadCount();
        allowMobilePageScroll();
    }
}


export function toggleWidget() {
    const {embedded, widgetOpened} = store.getState().appState;
    if (!embedded) {
        if (widgetOpened) {
            closeWidget();
        } else {
            openWidget();
        }
    }
}
