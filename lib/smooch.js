'use strict';

exports.__esModule = true;
exports.Smooch = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _lodash = require('lodash.pick');

var _lodash2 = _interopRequireDefault(_lodash);

var _appStore = require('./stores/app-store');

var _authActions = require('./actions/auth-actions');

var _userActions = require('./actions/user-actions');

var userActions = _interopRequireWildcard(_userActions);

var _appActions = require('./actions/app-actions');

var _uiActions = require('./actions/ui-actions');

var _conversationActions = require('./actions/conversation-actions');

var _integrationsActions = require('./actions/integrations-actions');

var _appStateActions = require('./actions/app-state-actions');

var AppStateActions = _interopRequireWildcard(_appStateActions);

var _commonActions = require('./actions/common-actions');

var _appService = require('./services/app-service');

var _authService = require('./services/auth-service');

var _stripeService = require('./services/stripe-service');

var _userService = require('./services/user-service');

var _conversationService = require('./services/conversation-service');

var _core = require('./services/core');

var _events = require('./utils/events');

var _dom = require('./utils/dom');

var _media = require('./utils/media');

var _sound = require('./utils/sound');

var _device = require('./utils/device');

var _app = require('./utils/app');

var _assets = require('./constants/assets');

var _version = require('./constants/version');

var _app2 = require('./constants/app');

var _root = require('./root');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function renderWidget(container) {
    _assets.stylesheet.use();
    if (container) {
        (0, _reactDom.render)(_react2.default.createElement(_root.Root, { store: _appStore.store }), container);
        return container;
    } else {
        var _ret = function () {
            var el = document.createElement('div');
            el.setAttribute('id', 'sk-holder');
            (0, _reactDom.render)(_react2.default.createElement(_root.Root, { store: _appStore.store }), el);

            (0, _dom.waitForPage)().then(function () {
                document.body.appendChild(el);
            });

            return {
                v: el
            };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
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
var unsubscribeFromStore = void 0;

function handleNotificationSound() {
    var _store$getState = _appStore.store.getState(),
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

        if (props.emailCaptureEnabled) {
            _appStore.store.dispatch(AppStateActions.enableEmailCapture());
        } else {
            _appStore.store.dispatch(AppStateActions.disableEmailCapture());
        }

        if (props.soundNotificationEnabled && (0, _sound.isAudioSupported)()) {
            _appStore.store.dispatch(AppStateActions.enableSoundNotification());
        } else {
            _appStore.store.dispatch(AppStateActions.disableSoundNotification());
        }

        if (props.imageUploadEnabled && (0, _media.isImageUploadSupported)()) {
            _appStore.store.dispatch(AppStateActions.enableImageUpload());
        } else {
            _appStore.store.dispatch(AppStateActions.disableImageUpload());
        }

        _appStore.store.dispatch(AppStateActions.setEmbedded(!!props.embedded));

        if (props.customText) {
            _appStore.store.dispatch((0, _uiActions.updateText)(props.customText));
        }

        if (props.serviceUrl) {
            _appStore.store.dispatch(AppStateActions.setServerURL(props.serviceUrl));
        }
        unsubscribeFromStore = (0, _events.observeStore)(_appStore.store, function (_ref2) {
            var conversation = _ref2.conversation;
            return conversation;
        }, onStoreChange);

        (0, _dom.monitorBrowserState)();
        return this.login(props.userId, props.jwt, (0, _lodash2.default)(props, _userService.EDITABLE_PROPERTIES));
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

        // in case those are opened;
        (0, _appService.hideSettings)();
        (0, _appService.hideChannelPage)();

        // in case it comes from a previous authenticated state
        _appStore.store.dispatch((0, _authActions.resetAuth)());
        _appStore.store.dispatch(userActions.resetUser());
        _appStore.store.dispatch((0, _conversationActions.resetConversation)());
        _appStore.store.dispatch((0, _integrationsActions.resetIntegrations)());

        (0, _conversationService.disconnectFaye)();

        attributes = (0, _lodash2.default)(attributes, _userService.EDITABLE_PROPERTIES);

        if (_appStore.store.getState().appState.emailCaptureEnabled && attributes.email) {
            _appStore.store.dispatch(AppStateActions.setEmailReadonly());
        } else {
            _appStore.store.dispatch(AppStateActions.unsetEmailReadonly());
        }

        _appStore.store.dispatch((0, _authActions.setAuth)({
            jwt: jwt,
            appToken: this.appToken
        }));

        lastTriggeredMessageTimestamp = 0;
        initialStoreChange = true;

        return (0, _authService.login)({
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
        }).then(function (loginResponse) {
            _appStore.store.dispatch(userActions.setUser(loginResponse.appUser));
            _appStore.store.dispatch((0, _appActions.setApp)(loginResponse.app));

            (0, _dom.monitorUrlChanges)(function () {
                (0, _userService.updateNowViewing)((0, _device.getDeviceId)());
            });

            if ((0, _app.hasChannels)(loginResponse.app.settings.web)) {
                _appStore.store.dispatch(AppStateActions.disableEmailCapture());
            }

            if ((0, _app.getIntegration)(loginResponse.app.integrations, 'stripeConnect')) {
                return (0, _stripeService.getAccount)().then(function (r) {
                    _appStore.store.dispatch((0, _appActions.setStripeInfo)(r.account));
                }).catch(function () {
                    // do nothing about it and let the flow continue
                });
            }
        }).then(function () {
            return (0, _userService.immediateUpdate)(attributes).then(function () {
                var user = _appStore.store.getState().user;
                if (user.conversationStarted) {
                    return (0, _conversationService.handleConversationUpdated)();
                }
            });
        }).then(function () {
            if (!_appStore.store.getState().appState.embedded) {
                if (!_this._container) {
                    _this._container = _this.render();
                }
            }

            var user = _appStore.store.getState().user;

            _events.observable.trigger('ready', user);

            return user;
        });
    };

    Smooch.prototype.logout = function logout() {
        return this.login();
    };

    Smooch.prototype.track = function track(eventName, userProps) {
        return (0, _userService.trackEvent)(eventName, userProps);
    };

    Smooch.prototype.sendMessage = function sendMessage(text) {
        return (0, _conversationService.sendMessage)(text);
    };

    Smooch.prototype.updateUser = function updateUser(props) {
        return (0, _userService.update)(props).then(function (response) {
            if (response.appUser.conversationStarted) {
                return (0, _conversationService.handleConversationUpdated)().then(function () {
                    return response;
                });
            }

            return response;
        });
    };

    Smooch.prototype.getConversation = function getConversation() {
        return (0, _conversationService.handleConversationUpdated)().then(function () {
            _appStore.store.dispatch(userActions.updateUser({
                conversationStarted: true
            }));
            return _appStore.store.getState().conversation;
        });
    };

    Smooch.prototype.getUserId = function getUserId() {
        return (0, _userService.getUserId)();
    };

    Smooch.prototype.getCore = function getCore() {
        return (0, _core.core)();
    };

    Smooch.prototype.destroy = function destroy() {
        if (!this.appToken) {
            console.warn('Smooch.destroy was called before Smooch.init was called properly.');
        }

        (0, _dom.stopMonitoringBrowserState)();

        if (process.env.NODE_ENV !== 'test' && this._container) {
            (0, _reactDom.unmountComponentAtNode)(this._container);
        }

        var embedded = _appStore.store.getState().appState.embedded;

        (0, _conversationService.disconnectFaye)();
        _appStore.store.dispatch((0, _commonActions.reset)());

        if (embedded) {
            // retain the embed mode
            _appStore.store.dispatch(AppStateActions.setEmbedded(true));
        } else if (this._container) {
            document.body.removeChild(this._container);
        }

        (0, _dom.stopMonitoringUrlChanges)();
        unsubscribeFromStore();

        delete this.appToken;
        delete this._container;
        _events.observable.trigger('destroy');
        _events.observable.off();
        _assets.stylesheet.unuse();
    };

    Smooch.prototype.open = function open() {
        (0, _appService.openWidget)();
    };

    Smooch.prototype.close = function close() {
        (0, _appService.closeWidget)();
    };

    Smooch.prototype.isOpened = function isOpened() {
        return _appStore.store.getState().appState.widgetState === _app2.WIDGET_STATE.OPENED;
    };

    Smooch.prototype.render = function render(container) {
        this._container = container;
        return renderWidget(container);
    };

    return Smooch;
}();