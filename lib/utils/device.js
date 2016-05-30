'use strict';

exports.__esModule = true;
exports.getDeviceId = getDeviceId;

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _storage = require('./storage');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getDeviceId() {
    var SK_STORAGE = 'sk_deviceid';
    var deviceId = _storage.storage.getItem(SK_STORAGE) || _uuid2.default.v4().replace(/-/g, '');

    _storage.storage.setItem(SK_STORAGE, deviceId);

    return deviceId;
}