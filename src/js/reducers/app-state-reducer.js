import * as AppStateActions from '../actions/app-state-actions';
import { RESET } from '../actions/common-actions';
import { RESET_CONVERSATION } from '../actions/conversation-actions';

const INITIAL_STATE = {
    settingsVisible: false,
    visibleChannelType: null,
    widgetOpened: null,
    settingsEnabled: true,
    soundNotificationEnabled: true,
    imageUploadEnabled: true,
    emailCaptureEnabled: false,
    readOnlyEmail: false,
    embedded: false,
    serverURL: 'https://api.smooch.io/',
    connectNotificationTimestamp: null,
    errorNotificationMessage: null,
    introHeight: 158
};

export function AppStateReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case RESET:
            return {
                ...INITIAL_STATE
            };
        case RESET_CONVERSATION:
            return {
                ...state,
                connectNotificationTimestamp: null
            };

        case AppStateActions.ENABLE_EMAIL_CAPTURE:
            return {
                ...state,
                emailCaptureEnabled: true
            };

        case AppStateActions.DISABLE_EMAIL_CAPTURE:
            return {
                ...state,
                emailCaptureEnabled: false
            };

        case AppStateActions.ENABLE_IMAGE_UPLOAD:
            return {
                ...state,
                imageUploadEnabled: true
            };

        case AppStateActions.DISABLE_IMAGE_UPLOAD:
            return {
                ...state,
                imageUploadEnabled: false
            };

        case AppStateActions.ENABLE_SOUND_NOTIFICATION:
            return {
                ...state,
                soundNotificationEnabled: true
            };

        case AppStateActions.DISABLE_SOUND_NOTIFICATION:
            return {
                ...state,
                soundNotificationEnabled: false
            };

        case AppStateActions.SET_EMAIL_READONLY:
            return {
                ...state,
                readOnlyEmail: true
            };

        case AppStateActions.UNSET_EMAIL_READONLY:
            return {
                ...state,
                readOnlyEmail: false
            };

        case AppStateActions.TOGGLE_WIDGET:
            return {
                ...state,
                widgetOpened: !state.widgetOpened,
                settingsVisible: state.settingsVisible && !state.widgetOpened
            };

        case AppStateActions.OPEN_WIDGET:
            return {
                ...state,
                widgetOpened: true
            };

        case AppStateActions.CLOSE_WIDGET:
            return {
                ...state,
                visibleChannelType: null,
                widgetOpened: false,
                settingsVisible: false
            };

        case AppStateActions.SHOW_SETTINGS:
            return {
                ...state,
                settingsVisible: true
            };

        case AppStateActions.HIDE_SETTINGS:
            return {
                ...state,
                settingsVisible: false
            };

        case AppStateActions.SHOW_CHANNEL_PAGE:
            return {
                ...state,
                visibleChannelType: action.channelType
            };

        case AppStateActions.HIDE_CHANNEL_PAGE:
            return {
                ...state,
                visibleChannelType: undefined
            };

        case AppStateActions.SHOW_CONNECT_NOTIFICATION:
            return {
                ...state,
                connectNotificationTimestamp: action.timestamp
            };

        case AppStateActions.HIDE_CONNECT_NOTIFICATION:
            return {
                ...state,
                connectNotificationTimestamp: null
            };

        case AppStateActions.SET_SERVER_URL:
            return {
                ...state,
                serverURL: action.url
            };

        case AppStateActions.SHOW_ERROR_NOTIFICATION:
            return {
                ...state,
                errorNotificationMessage: action.message
            };

        case AppStateActions.HIDE_ERROR_NOTIFICATION:
            return {
                ...state,
                errorNotificationMessage: null
            };

        case AppStateActions.SET_EMBEDDED:
            return {
                ...state,
                embedded: action.value,
                widgetOpened: action.value ? true : state.widgetOpened
            };

        case AppStateActions.SET_INTRO_HEIGHT:
            return {
                ...state,
                introHeight: action.value
            };

        default:
            return state;
    }
}
