'use strict';

exports.__esModule = true;
exports.initFaye = initFaye;

var _faye = require('faye');

var _urljoin = require('urljoin');

var _urljoin2 = _interopRequireDefault(_urljoin);

var _appStore = require('../stores/app-store');

var _conversationActions = require('../actions/conversation-actions');

var _conversationService = require('../services/conversation-service');

var _device = require('./device');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function initFaye() {
    var state = _appStore.store.getState();

    if (!state.faye.subscription) {
        var faye = new _faye.Client((0, _urljoin2.default)(state.appState.serverURL, 'faye'));

        faye.addExtension({
            outgoing: function outgoing(message, callback) {
                if (message.channel === '/meta/subscribe') {
                    message.appUserId = state.user._id;

                    if (state.auth.appToken) {
                        message.appToken = state.auth.appToken;
                    }

                    if (state.auth.jwt) {
                        message.jwt = state.auth.jwt;
                    }
                }

                callback(message);
            }
        });

        faye.on('transport:up', function () {
            var user = _appStore.store.getState().user;

            if (user.conversationStarted) {
                (0, _conversationService.getConversation)();
            }
        });

        return faye.subscribe('/v1/conversations/' + state.conversation._id, function (message) {
            if (message.source.id !== (0, _device.getDeviceId)()) {
                _appStore.store.dispatch((0, _conversationActions.addMessage)(message));
            }
            if (message.role !== 'appUser') {
                _appStore.store.dispatch((0, _conversationActions.incrementUnreadCount)());
            }
        });
    }
}