import * as AppStateActions from '../actions/app-state';
import { RESET } from '../actions/common';
import { RESET_CONVERSATION, ADD_MESSAGE } from '../actions/conversation';
import { WIDGET_STATE } from '../constants/app';

const INITIAL_STATE = {
    settingsVisible: false,
    visibleChannelType: null,
    widgetState: WIDGET_STATE.INIT,
    widgetSize: 'md',
    connectNotificationTimestamp: null,
    errorNotificationMessage: null,
    introHeight: 158,
    showAnimation: false,
    isFetchingMoreMessages: false,
    shouldScrollToBottom: true,
    typingIndicatorShown: false,
    typingIndicatorAvatarUrl: null,
    typingIndicatorName: null,
    typingIndicatorTimeoutId: null
};

export default function AppStateReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case RESET:
            // keep widget state even on a reset
            return {
                ...INITIAL_STATE,
                widgetSize: state.widgetSize
            };
        case RESET_CONVERSATION:
            return {
                ...state,
                connectNotificationTimestamp: null
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
                widgetState: state.widgetState === WIDGET_STATE.OPENED ? WIDGET_STATE.CLOSED : WIDGET_STATE.OPENED,
                settingsVisible: state.settingsVisible && state.widgetState !== WIDGET_STATE.OPENED,
                showAnimation: true
            };

        case AppStateActions.OPEN_WIDGET:
            return {
                ...state,
                widgetState: WIDGET_STATE.OPENED,
                showAnimation: true
            };

        case AppStateActions.CLOSE_WIDGET:
            return {
                ...state,
                visibleChannelType: null,
                widgetState: WIDGET_STATE.CLOSED,
                settingsVisible: false,
                showAnimation: true
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
                widgetState: action.value ? WIDGET_STATE.EMBEDDED : WIDGET_STATE.INIT,
                widgetSize: action.value ? 'embedded' : state.widgetSize
            };

        case AppStateActions.SET_INTRO_HEIGHT:
            return {
                ...state,
                introHeight: action.value
            };

        case AppStateActions.DISABLE_ANIMATION:
            return {
                ...state,
                showAnimation: false
            };

        case AppStateActions.SET_FETCHING_MORE_MESSAGES:
            return {
                ...state,
                isFetchingMoreMessages: action.value
            };
        case AppStateActions.SET_SHOULD_SCROLL_TO_BOTTOM:
            return {
                ...state,
                shouldScrollToBottom: action.value
            };

        case AppStateActions.SHOW_TYPING_INDICATOR:
            return {
                ...state,
                typingIndicatorShown: true,
                typingIndicatorAvatarUrl: action.avatarUrl,
                typingIndicatorName: action.name,
                typingIndicatorTimeoutId: action.timeoutId
            };
        case AppStateActions.HIDE_TYPING_INDICATOR:
            return {
                ...state,
                typingIndicatorShown: false,
                typingIndicatorName: null,
                typingIndicatorAvatarUrl: null,
                typingIndicatorTimeoutId: null
            };

        case ADD_MESSAGE:
            if (action.message.role === 'appMaker') {
                return {
                    ...state,
                    typingIndicatorShown: false,
                    typingIndicatorName: null,
                    typingIndicatorAvatarUrl: null,
                    typingIndicatorTimeoutId: null
                };
            }

            return state;
        case AppStateActions.UPDATE_WIDGET_SIZE:
            return {
                ...state,
                widgetSize: action.size
            };
        default:
            return state;
    }
}
