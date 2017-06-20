'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.getIntegration = getIntegration;
exports.hasChannels = hasChannels;
exports.getAppChannelDetails = getAppChannelDetails;

var _channels = require('../constants/channels');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getTimestamp(objectId) {
    return new Date(parseInt(objectId.toString().slice(0, 8), 16) * 1000);
}

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
    var smsIntegrationDate = void 0;

    return (0, _keys2.default)(_channels.CHANNEL_DETAILS).map(function (key) {
        return getIntegration(appChannels, key);
    }).filter(function (channel) {
        return channel;
    }).filter(function (channel) {
        var name = _channels.CHANNEL_DETAILS[channel.type].name;


        if (name === 'SMS') {
            var channelIntegrationDate = getTimestamp(channel._id);

            if (!smsIntegrationDate) {
                smsIntegrationDate = channelIntegrationDate;
            }

            if (smsIntegrationDate.getTime() < channelIntegrationDate.getTime()) {
                return false;
            }
        }

        return true;
    }).map(function (channel) {

        return {
            channel: channel,
            details: (0, _extends3.default)({
                type: channel.type
            }, _channels.CHANNEL_DETAILS[channel.type])
        };
    });
}