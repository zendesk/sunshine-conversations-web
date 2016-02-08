import * as AppStateActions from 'actions/app-state-actions';
import { RESET } from 'actions/common-actions';

const INITIAL_STATE = {
    settingsVisible: false,
    settingsNotificationVisible: false,
    widgetOpened: null,
    settingsEnabled: true,
    readOnlyEmail: false,
    serverURL: 'https://api.smooch.io/',
    errorNotificationMessage: null
};

export function AppStateReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case RESET:
            return Object.assign({}, INITIAL_STATE);

        case AppStateActions.ENABLE_SETTINGS:
            return Object.assign({}, state, {
                settingsEnabled: true
            });

        case AppStateActions.DISABLE_SETTINGS:
            return Object.assign({}, state, {
                settingsEnabled: false
            });

        case AppStateActions.SET_EMAIL_READONLY:
            return Object.assign({}, state, {
                readOnlyEmail: true
            });

        case AppStateActions.UNSET_EMAIL_READONLY:
            return Object.assign({}, state, {
                readOnlyEmail: false
            });

        case AppStateActions.TOGGLE_WIDGET:
            return Object.assign({}, state, {
                widgetOpened: !state.widgetOpened,
                settingsVisible: state.settingsVisible && !state.widgetOpened
            });

        case AppStateActions.OPEN_WIDGET:
            return Object.assign({}, state, {
                widgetOpened: true
            });
        case AppStateActions.CLOSE_WIDGET:
            return Object.assign({}, state, {
                widgetOpened: false
            });
        case AppStateActions.SHOW_SETTINGS:
            return Object.assign({}, state, {
                settingsVisible: true
            });
        case AppStateActions.HIDE_SETTINGS:
            return Object.assign({}, state, {
                settingsVisible: false
            });
        case AppStateActions.SHOW_SETTINGS_NOTIFICATION:
            return Object.assign({}, state, {
                settingsNotificationVisible: true
            });
        case AppStateActions.HIDE_SETTINGS_NOTIFICATION:
            return Object.assign({}, state, {
                settingsNotificationVisible: false
            });
        case AppStateActions.SET_SERVER_URL:
            return Object.assign({}, state, {
                serverURL: action.url
            });
        case AppStateActions.SHOW_ERROR_NOTIFICATION:
            return Object.assign({}, state, {
                settingsNotificationVisible: false,
                errorNotificationMessage: action.message
            });
        case AppStateActions.HIDE_ERROR_NOTIFICATION:
            return Object.assign({}, state, {
                settingsNotificationVisible: false,
                errorNotificationMessage: null
            });
        default:
            return state;
    }
}
