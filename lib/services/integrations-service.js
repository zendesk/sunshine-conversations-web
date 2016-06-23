'use strict';

exports.__esModule = true;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.fetchWeChatQRCode = fetchWeChatQRCode;

var _appStore = require('../stores/app-store');

var _core = require('./core');

var _integrationsActions = require('../actions/integrations-actions');

var _userService = require('./user-service');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fetchingWeChat = false;

function fetchWeChatQRCode() {
    var _store$getState = _appStore.store.getState();

    var wechat = _store$getState.integrations.wechat;


    if (wechat.qrCode || fetchingWeChat) {
        return _promise2.default.resolve();
    }

    _appStore.store.dispatch((0, _integrationsActions.unsetWeChatError)());
    fetchingWeChat = true;
    return (0, _core.core)().appUsers.wechat.getQRCode((0, _userService.getUserId)()).then(function (_ref) {
        var url = _ref.url;

        _appStore.store.dispatch((0, _integrationsActions.setWeChatQRCode)(url));
    }).catch(function () {
        _appStore.store.dispatch((0, _integrationsActions.setWeChatError)());
    }).then(function () {
        fetchingWeChat = false;
    });
}