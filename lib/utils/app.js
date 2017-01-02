'use strict';

exports.__esModule = true;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.getIntegration = getIntegration;
exports.hasChannels = hasChannels;
exports.getAppChannelDetails = getAppChannelDetails;

var _channels = require('../constants/channels');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getIntegration(appChannels, type) {
    var appChannelsOfType = appChannels.filter(function (channel) {
        return channel.type === type;
    });
    return appChannelsOfType.length > 0 ? appChannelsOfType[0] : undefined;
}

function hasChannels(_ref) {
    var channels = _ref.channels;

    return (0, _keys2.default)(channels).some(function (key) {
        return channels[key];
    });
}

function getAppChannelDetails(appChannels) {
    return (0, _keys2.default)(_channels.CHANNEL_DETAILS).map(function (key) {
        return getIntegration(appChannels, key);
    }).filter(function (channel) {
        return channel;
    }).map(function (channel) {
        return {
            channel: channel,
            details: _channels.CHANNEL_DETAILS[channel.type]
        };
    });
}