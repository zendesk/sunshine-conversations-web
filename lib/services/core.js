'use strict';

exports.__esModule = true;
exports.core = core;

var _smooch = require('smooch-core/lib/smooch');

var _urljoin = require('urljoin');

var _urljoin2 = _interopRequireDefault(_urljoin);

var _version = require('../constants/version');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function core(_ref) {
    var auth = _ref.auth,
        appState = _ref.appState;

    return new _smooch.Smooch(auth, {
        serviceUrl: (0, _urljoin2.default)(appState.serverURL, 'v1'),
        headers: {
            'x-smooch-sdk': 'web/' + _version.VERSION
        }
    });
}