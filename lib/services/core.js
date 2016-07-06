'use strict';

exports.__esModule = true;
exports.core = core;

var _smooch = require('smooch-core/lib/smooch');

var _urljoin = require('urljoin');

var _urljoin2 = _interopRequireDefault(_urljoin);

var _version = require('../constants/version');

var _appStore = require('../stores/app-store');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function core() {
    var auth = _appStore.store.getState().auth;
    return new _smooch.Smooch(auth, {
        serviceUrl: (0, _urljoin2.default)(_appStore.store.getState().appState.serverURL, 'v1'),
        headers: {
            'x-smooch-sdk': 'web/' + _version.VERSION
        }
    });
}