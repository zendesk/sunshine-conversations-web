import { ENABLE_SETTINGS, DISABLE_SETTINGS, TOGGLE_WIDGET, OPEN_WIDGET, CLOSE_WIDGET, SHOW_SETTINGS, HIDE_SETTINGS, SHOW_SETTINGS_NOTIFICATION, HIDE_SETTINGS_NOTIFICATION, SET_SERVER_URL, SET_EMAIL_READONLY, UNSET_EMAIL_READONLY } from 'actions/app-state-actions';
import { RESET } from 'actions/common-actions';

const INITIAL_STATE = {
    settingsVisible: false,
    settingsNotificationVisible: false,
    widgetOpened: undefined,
    settingsEnabled: true,
    readOnlyEmail: false,
    serverURL: 'https://api.smooch.io/'
};

export function AppStateReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case RESET:
            return Object.assign({}, INITIAL_STATE);

        case ENABLE_SETTINGS:
            return Object.assign({}, state, {
                settingsEnabled: true
            });

        case DISABLE_SETTINGS:
            return Object.assign({}, state, {
                settingsEnabled: false
            });

        case SET_EMAIL_READONLY:
            return Object.assign({}, state, {
                readOnlyEmail: true
            });

        case UNSET_EMAIL_READONLY:
            return Object.assign({}, state, {
                readOnlyEmail: false
            });

        case TOGGLE_WIDGET:
            return Object.assign({}, state, {
                widgetOpened: !state.widgetOpened,
                settingsVisible: state.settingsVisible && !state.widgetOpened
            });

        case OPEN_WIDGET:
            return Object.assign({}, state, {
                widgetOpened: true
            });
        case CLOSE_WIDGET:
            return Object.assign({}, state, {
                widgetOpened: false
            });
        case SHOW_SETTINGS:
            return Object.assign({}, state, {
                settingsVisible: true
            });
        case HIDE_SETTINGS:
            return Object.assign({}, state, {
                settingsVisible: false
            });
        case SHOW_SETTINGS_NOTIFICATION:
            return Object.assign({}, state, {
                settingsNotificationVisible: true
            });
        case HIDE_SETTINGS_NOTIFICATION:
            return Object.assign({}, state, {
                settingsNotificationVisible: false
            });
        case SET_SERVER_URL:
            return Object.assign({}, state, {
                serverURL: action.url
            });
        default:
            return state;
    }
}
