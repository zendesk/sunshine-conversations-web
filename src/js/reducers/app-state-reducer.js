import * as AppStateActions from '../actions/app-state-actions';
import { RESET } from '../actions/common-actions';

const INITIAL_STATE = {
    settingsVisible: false,
    visibleChannelType: null,
    widgetOpened: null,
    settingsEnabled: true,
    soundNotificationEnabled: true,
    imageUploadEnabled: true,
    readOnlyEmail: false,
    embedded: false,
    serverURL: 'https://api.smooch.io/',
    notificationMessage: null,
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

        case AppStateActions.ENABLE_IMAGE_UPLOAD:
            return Object.assign({}, state, {
                imageUploadEnabled: true
            });

        case AppStateActions.DISABLE_IMAGE_UPLOAD:
            return Object.assign({}, state, {
                imageUploadEnabled: false
            });

        case AppStateActions.ENABLE_SOUND_NOTIFICATION:
            return Object.assign({}, state, {
                soundNotificationEnabled: true
            });

        case AppStateActions.DISABLE_SOUND_NOTIFICATION:
            return Object.assign({}, state, {
                soundNotificationEnabled: false
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
                widgetOpened: false,
                settingsVisible: false
            });
        case AppStateActions.SHOW_SETTINGS:
            return Object.assign({}, state, {
                settingsVisible: true
            });
        case AppStateActions.HIDE_SETTINGS:
            return Object.assign({}, state, {
                settingsVisible: false
            });
        case AppStateActions.SHOW_CHANNEL_PAGE:
            return Object.assign({}, state, {
                visibleChannelType: action.channelType
            });
        case AppStateActions.HIDE_CHANNEL_PAGE:
            return Object.assign({}, state, {
                visibleChannelType: undefined
            });
        case AppStateActions.SHOW_NOTIFICATION:
            return Object.assign({}, state, {
                errorNotificationMessage: null,
                notificationMessage: action.message
            });
        case AppStateActions.HIDE_NOTIFICATION:
            return Object.assign({}, state, {
                notificationMessage: null,
                errorNotificationMessage: null
            });
        case AppStateActions.SET_SERVER_URL:
            return Object.assign({}, state, {
                serverURL: action.url
            });
        case AppStateActions.SHOW_ERROR_NOTIFICATION:
            return Object.assign({}, state, {
                notificationMessage: null,
                errorNotificationMessage: action.message
            });
        case AppStateActions.HIDE_ERROR_NOTIFICATION:
            return Object.assign({}, state, {
                notificationMessage: null,
                errorNotificationMessage: null
            });
        case AppStateActions.SET_EMBEDDED:
            return Object.assign({}, state, {
                embedded: action.value,
                widgetOpened: action.value ? true : state.widgetOpened
            });
        default:
            return state;
    }
}
