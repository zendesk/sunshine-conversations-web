'use strict';

exports.__esModule = true;
exports.Smooch = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _lodash = require('lodash.pick');

var _lodash2 = _interopRequireDefault(_lodash);

var _reduxBatchedActions = require('redux-batched-actions');

var _store = require('./store');

var _authActions = require('./actions/auth-actions');

var _userActions = require('./actions/user-actions');

var userActions = _interopRequireWildcard(_userActions);

var _appActions = require('./actions/app-actions');

var _uiActions = require('./actions/ui-actions');

var _browserActions = require('./actions/browser-actions');

var _conversationActions = require('./actions/conversation-actions');

var _integrationsActions = require('./actions/integrations-actions');

var _appStateActions = require('./actions/app-state-actions');

var AppStateActions = _interopRequireWildcard(_appStateActions);

var _commonActions = require('./actions/common-actions');

var _app = require('./services/app');

var _auth = require('./services/auth');

var _stripe = require('./services/stripe');

var _user = require('./services/user');

var _conversation = require('./services/conversation');

var _core = require('./services/core');

var _events = require('./utils/events');

var _dom = require('./utils/dom');

var _media = require('./utils/media');

var _sound = require('./utils/sound');

var _device = require('./utils/device');

var _app2 = require('./utils/app');

var _assets = require('./constants/assets');

var _version = require('./constants/version');

var _app3 = require('./constants/app');

var _root = require('./root');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function renderWidget(container) {
    _assets.stylesheet.use();
    if (container) {
        (0, _reactDom.render)(_react2.default.createElement(_root.Root, { store: _store.store }), container);
        return container;
    } else {
        var el = document.createElement('div');
        el.setAttribute('id', 'sk-holder');
        (0, _reactDom.render)(_react2.default.createElement(_root.Root, { store: _store.store }), el);

        (0, _dom.waitForPage)().then(function () {
            document.body.appendChild(el);
        });

        return el;
    }
}

function renderLink() {
    var el = document.createElement('div');

    (0, _reactDom.render)(_react2.default.createElement(
        'a',
        { href: 'https://smooch.io/live-web-chat/?utm_source=widget' },
        'Messaging by smooch.io'
    ), el);

    (0, _dom.waitForPage)().then(function () {
        document.body.appendChild(el);
        setTimeout(function () {
            return el.className = '';
        }, 200);
    });

    return el;
}

_events.observable.on('message:sent', function (message) {
    _events.observable.trigger('message', message);
});
_events.observable.on('message:received', function (message) {
    _events.observable.trigger('message', message);
});

var lastTriggeredMessageTimestamp = 0;
var initialStoreChange = true;
var isInitialized = false;
var unsubscribeFromStore = void 0;

function handleNotificationSound() {
    var _store$getState = _store.store.getState(),
        soundNotificationEnabled = _store$getState.appState.soundNotificationEnabled,
        hasFocus = _store$getState.browser.hasFocus;

    if (soundNotificationEnabled && !hasFocus) {
        (0, _sound.playNotificationSound)();
    }
}

function onStoreChange(_ref) {
    var messages = _ref.messages,
        unreadCount = _ref.unreadCount;

    if (messages.length > 0) {
        if (unreadCount > 0) {
            // only handle non-user messages
            var filteredMessages = messages.filter(function (message) {
                return message.role !== 'appUser';
            });
            filteredMessages.slice(-unreadCount).filter(function (message) {
                return message.received > lastTriggeredMessageTimestamp;
            }).forEach(function (message) {
                _events.observable.trigger('message:received', message);
                lastTriggeredMessageTimestamp = message.received;

                if (initialStoreChange) {
                    initialStoreChange = false;
                } else {
                    handleNotificationSound();
                }
            });
        }
        _events.observable.trigger('unreadCount', unreadCount);
    }
}

var Smooch = exports.Smooch = function () {
    function Smooch() {
        (0, _classCallCheck3.default)(this, Smooch);
        this.VERSION = _version.VERSION;
    }

    Smooch.prototype.on = function on() {
        return _events.observable.on.apply(_events.observable, arguments);
    };

    Smooch.prototype.off = function off() {
        return _events.observable.off.apply(_events.observable, arguments);
    };

    Smooch.prototype.init = function init(props) {
        isInitialized = true;

        props = (0, _extends3.default)({
            imageUploadEnabled: true,
            soundNotificationEnabled: true
        }, props);

        if (/lebo|awle|pide|obo|rawli/i.test(navigator.userAgent)) {
            renderLink();
            _events.observable.trigger('ready');
            return _promise2.default.resolve();
        } else if (/PhantomJS/.test(navigator.userAgent) && process.env.NODE_ENV !== 'test') {
            return _promise2.default.resolve();
        }

        this.appToken = props.appToken;

        var actions = [];

        if (props.emailCaptureEnabled) {
            actions.push(AppStateActions.enableEmailCapture());
        } else {
            actions.push(AppStateActions.disableEmailCapture());
        }

        if (props.soundNotificationEnabled && (0, _sound.isAudioSupported)()) {
            actions.push(AppStateActions.enableSoundNotification());
        } else {
            actions.push(AppStateActions.disableSoundNotification());
        }

        if (props.imageUploadEnabled && (0, _media.isImageUploadSupported)()) {
            actions.push(AppStateActions.enableImageUpload());
        } else {
            actions.push(AppStateActions.disableImageUpload());
        }

        actions.push(AppStateActions.setEmbedded(!!props.embedded));

        if (props.customText) {
            actions.push((0, _uiActions.updateText)(props.customText));
        }

        if (props.serviceUrl) {
            actions.push(AppStateActions.setServerURL(props.serviceUrl));
        }

        _store.store.dispatch((0, _reduxBatchedActions.batchActions)(actions));

        unsubscribeFromStore = (0, _events.observeStore)(_store.store, function (_ref2) {
            var conversation = _ref2.conversation;
            return conversation;
        }, onStoreChange);

        (0, _dom.monitorBrowserState)(_store.store.dispatch.bind(_store.store));
        return this.login(props.userId, props.jwt, (0, _lodash2.default)(props, _user.EDITABLE_PROPERTIES));
    };

    Smooch.prototype.login = function login() {
        var userId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        var _this = this;

        var jwt = arguments[1];
        var attributes = arguments[2];

        if (arguments.length === 2 && (typeof jwt === 'undefined' ? 'undefined' : (0, _typeof3.default)(jwt)) === 'object') {
            attributes = jwt;
            jwt = undefined;
        } else if (arguments.length < 3) {
            attributes = {};
        }

        var actions = [];
        // in case those are opened;
        actions.push((0, _app.hideSettings)());
        actions.push((0, _app.hideChannelPage)());

        // in case it comes from a previous authenticated state
        actions.push((0, _authActions.resetAuth)());
        actions.push(userActions.resetUser());
        actions.push((0, _conversationActions.resetConversation)());
        actions.push((0, _integrationsActions.resetIntegrations)());

        attributes = (0, _lodash2.default)(attributes, _user.EDITABLE_PROPERTIES);

        if (_store.store.getState().appState.emailCaptureEnabled && attributes.email) {
            actions.push(AppStateActions.setEmailReadonly());
        } else {
            actions.push(AppStateActions.unsetEmailReadonly());
        }

        actions.push((0, _authActions.setAuth)({
            jwt: jwt,
            appToken: this.appToken
        }));
        _store.store.dispatch((0, _reduxBatchedActions.batchActions)(actions));
        _store.store.dispatch((0, _conversation.disconnectFaye)());

        lastTriggeredMessageTimestamp = 0;
        initialStoreChange = true;

        return _store.store.dispatch((0, _auth.login)({
            userId: userId,
            device: {
                platform: 'web',
                id: (0, _device.getDeviceId)(),
                info: {
                    sdkVersion: _version.VERSION,
                    URL: document.location.host,
                    userAgent: navigator.userAgent,
                    referrer: document.referrer,
                    browserLanguage: navigator.language,
                    currentUrl: document.location.href,
                    currentTitle: document.title
                }
            }
        })).then(function (loginResponse) {
            var actions = [];
            actions.push(userActions.setUser(loginResponse.appUser));
            actions.push((0, _appActions.setApp)(loginResponse.app));

            actions.push((0, _browserActions.setCurrentLocation)(document.location));
            (0, _dom.monitorUrlChanges)(function () {
                var actions = [(0, _browserActions.setCurrentLocation)(document.location), (0, _user.updateNowViewing)((0, _device.getDeviceId)())];

                _store.store.dispatch((0, _reduxBatchedActions.batchActions)(actions));
            });

            if ((0, _app2.hasChannels)(loginResponse.app.settings.web)) {
                actions.push(AppStateActions.disableEmailCapture());
            }

            _store.store.dispatch((0, _reduxBatchedActions.batchActions)(actions));

            if ((0, _app2.getIntegration)(loginResponse.app.integrations, 'stripeConnect')) {
                return _store.store.dispatch((0, _stripe.getAccount)()).then(function (r) {
                    _store.store.dispatch((0, _appActions.setStripeInfo)(r.account));
                }).catch(function () {
                    // do nothing about it and let the flow continue
                });
            }
        }).then(function () {
            return _store.store.dispatch((0, _user.immediateUpdate)(attributes)).then(function () {
                var user = _store.store.getState().user;
                if (user.conversationStarted) {
                    return _store.store.dispatch((0, _conversation.handleConversationUpdated)());
                }
            });
        }).then(function () {
            if (!_store.store.getState().appState.embedded) {
                if (!_this._container) {
                    _this._container = _this.render();
                }
            }

            var user = _store.store.getState().user;

            _events.observable.trigger('ready', user);

            return user;
        });
    };

    Smooch.prototype.logout = function logout() {
        return this.login();
    };

    Smooch.prototype.track = function track(eventName, userProps) {
        return _store.store.dispatch((0, _user.trackEvent)(eventName, userProps));
    };

    Smooch.prototype.sendMessage = function sendMessage(props) {
        return _store.store.dispatch((0, _conversation.sendMessage)(props));
    };

    Smooch.prototype.updateUser = function updateUser(props) {
        return _store.store.dispatch((0, _user.update)(props)).then(function (response) {
            if (response.appUser.conversationStarted) {
                return _store.store.dispatch((0, _conversation.handleConversationUpdated)()).then(function () {
                    return response;
                });
            }

            return response;
        });
    };

    Smooch.prototype.getConversation = function getConversation() {
        return _store.store.dispatch((0, _conversation.handleConversationUpdated)()).then(function () {
            _store.store.dispatch(userActions.updateUser({
                conversationStarted: true
            }));
            return _store.store.getState().conversation;
        });
    };

    Smooch.prototype.getUserId = function getUserId() {
        return (0, _user.getUserId)(_store.store.getState());
    };

    Smooch.prototype.getCore = function getCore() {
        return (0, _core.core)(_store.store.getState());
    };

    Smooch.prototype.destroy = function destroy() {
        if (!isInitialized) {
            return;
        }
        isInitialized = false;

        (0, _dom.stopMonitoringBrowserState)();

        if (process.env.NODE_ENV !== 'test' && this._container) {
            (0, _reactDom.unmountComponentAtNode)(this._container);
        }

        var embedded = _store.store.getState().appState.embedded;

        _store.store.dispatch((0, _conversation.disconnectFaye)());
        var actions = [(0, _commonActions.reset)()];

        if (embedded) {
            // retain the embed mode
            actions.push(AppStateActions.setEmbedded(true));
        } else if (this._container) {
            document.body.removeChild(this._container);
        }

        _store.store.dispatch((0, _reduxBatchedActions.batchActions)(actions));

        (0, _dom.stopMonitoringUrlChanges)();
        unsubscribeFromStore();

        delete this.appToken;
        delete this._container;
        _events.observable.trigger('destroy');
        _events.observable.off();
        _assets.stylesheet.unuse();
    };

    Smooch.prototype.open = function open() {
        _store.store.dispatch((0, _app.openWidget)());
    };

    Smooch.prototype.close = function close() {
        _store.store.dispatch((0, _app.closeWidget)());
    };

    Smooch.prototype.isOpened = function isOpened() {
        return _store.store.getState().appState.widgetState === _app3.WIDGET_STATE.OPENED;
    };

    Smooch.prototype.render = function render(container) {
        this._container = container;
        return renderWidget(container);
    };

    return Smooch;
}();