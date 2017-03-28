'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.AppStateReducer = AppStateReducer;

var _appStateActions = require('../actions/app-state-actions');

var AppStateActions = _interopRequireWildcard(_appStateActions);

var _commonActions = require('../actions/common-actions');

var _conversationActions = require('../actions/conversation-actions');

var _app = require('../constants/app');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INITIAL_STATE = {
    settingsVisible: false,
    visibleChannelType: null,
    widgetState: _app.WIDGET_STATE.INIT,
    settingsEnabled: true,
    soundNotificationEnabled: true,
    imageUploadEnabled: true,
    emailCaptureEnabled: false,
    readOnlyEmail: false,
    embedded: false,
    serverURL: 'https://api.smooch.io/',
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

function AppStateReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
    var action = arguments[1];

    switch (action.type) {
        case _commonActions.RESET:
            return (0, _extends3.default)({}, INITIAL_STATE);
        case _conversationActions.RESET_CONVERSATION:
            return (0, _extends3.default)({}, state, {
                connectNotificationTimestamp: null
            });

        case AppStateActions.ENABLE_EMAIL_CAPTURE:
            return (0, _extends3.default)({}, state, {
                emailCaptureEnabled: true
            });

        case AppStateActions.DISABLE_EMAIL_CAPTURE:
            return (0, _extends3.default)({}, state, {
                emailCaptureEnabled: false
            });

        case AppStateActions.ENABLE_IMAGE_UPLOAD:
            return (0, _extends3.default)({}, state, {
                imageUploadEnabled: true
            });

        case AppStateActions.DISABLE_IMAGE_UPLOAD:
            return (0, _extends3.default)({}, state, {
                imageUploadEnabled: false
            });

        case AppStateActions.ENABLE_SOUND_NOTIFICATION:
            return (0, _extends3.default)({}, state, {
                soundNotificationEnabled: true
            });

        case AppStateActions.DISABLE_SOUND_NOTIFICATION:
            return (0, _extends3.default)({}, state, {
                soundNotificationEnabled: false
            });

        case AppStateActions.SET_EMAIL_READONLY:
            return (0, _extends3.default)({}, state, {
                readOnlyEmail: true
            });

        case AppStateActions.UNSET_EMAIL_READONLY:
            return (0, _extends3.default)({}, state, {
                readOnlyEmail: false
            });

        case AppStateActions.TOGGLE_WIDGET:

            return (0, _extends3.default)({}, state, {
                widgetState: state.widgetState === _app.WIDGET_STATE.OPENED ? _app.WIDGET_STATE.CLOSED : _app.WIDGET_STATE.OPENED,
                settingsVisible: state.settingsVisible && state.widgetState !== _app.WIDGET_STATE.OPENED,
                showAnimation: true
            });

        case AppStateActions.OPEN_WIDGET:
            return (0, _extends3.default)({}, state, {
                widgetState: _app.WIDGET_STATE.OPENED,
                showAnimation: true
            });

        case AppStateActions.CLOSE_WIDGET:
            return (0, _extends3.default)({}, state, {
                visibleChannelType: null,
                widgetState: _app.WIDGET_STATE.CLOSED,
                settingsVisible: false,
                showAnimation: true
            });

        case AppStateActions.SHOW_SETTINGS:
            return (0, _extends3.default)({}, state, {
                settingsVisible: true
            });

        case AppStateActions.HIDE_SETTINGS:
            return (0, _extends3.default)({}, state, {
                settingsVisible: false
            });

        case AppStateActions.SHOW_CHANNEL_PAGE:
            return (0, _extends3.default)({}, state, {
                visibleChannelType: action.channelType
            });

        case AppStateActions.HIDE_CHANNEL_PAGE:
            return (0, _extends3.default)({}, state, {
                visibleChannelType: undefined
            });

        case AppStateActions.SHOW_CONNECT_NOTIFICATION:
            return (0, _extends3.default)({}, state, {
                connectNotificationTimestamp: action.timestamp
            });

        case AppStateActions.HIDE_CONNECT_NOTIFICATION:
            return (0, _extends3.default)({}, state, {
                connectNotificationTimestamp: null
            });

        case AppStateActions.SET_SERVER_URL:
            return (0, _extends3.default)({}, state, {
                serverURL: action.url
            });

        case AppStateActions.SHOW_ERROR_NOTIFICATION:
            return (0, _extends3.default)({}, state, {
                errorNotificationMessage: action.message
            });

        case AppStateActions.HIDE_ERROR_NOTIFICATION:
            return (0, _extends3.default)({}, state, {
                errorNotificationMessage: null
            });

        case AppStateActions.SET_EMBEDDED:
            return (0, _extends3.default)({}, state, {
                embedded: action.value,
                widgetState: action.value ? _app.WIDGET_STATE.OPENED : state.widgetState
            });

        case AppStateActions.SET_INTRO_HEIGHT:
            return (0, _extends3.default)({}, state, {
                introHeight: action.value
            });

        case AppStateActions.DISABLE_ANIMATION:
            return (0, _extends3.default)({}, state, {
                showAnimation: false
            });

        case AppStateActions.SET_FETCHING_MORE_MESSAGES:
            return (0, _extends3.default)({}, state, {
                isFetchingMoreMessages: action.value
            });
        case AppStateActions.SET_SHOULD_SCROLL_TO_BOTTOM:
            return (0, _extends3.default)({}, state, {
                shouldScrollToBottom: action.value
            });

        case AppStateActions.SHOW_TYPING_INDICATOR:
            return (0, _extends3.default)({}, state, {
                typingIndicatorShown: true,
                typingIndicatorAvatarUrl: action.avatarUrl,
                typingIndicatorName: action.name,
                typingIndicatorTimeoutId: action.timeoutId
            });
        case AppStateActions.HIDE_TYPING_INDICATOR:
            return (0, _extends3.default)({}, state, {
                typingIndicatorShown: false,
                typingIndicatorName: null,
                typingIndicatorAvatarUrl: null,
                typingIndicatorTimeoutId: null
            });

        case _conversationActions.ADD_MESSAGE:
            if (action.message.role === 'appMaker') {
                return (0, _extends3.default)({}, state, {
                    typingIndicatorShown: false,
                    typingIndicatorName: null,
                    typingIndicatorAvatarUrl: null,
                    typingIndicatorTimeoutId: null
                });
            }

            return state;

        default:
            return state;
    }
}